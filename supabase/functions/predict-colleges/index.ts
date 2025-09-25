import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface College {
  college_name: string;
  branch_name: string;
  fees_per_year: number;
  closing_percentile: number;
  location: string;
  round_number: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { percentile, category, domicile, branch_ids } = await req.json();
    
    console.log('Prediction request:', { percentile, category, domicile, branch_ids });

    // Validate inputs
    if (!percentile || !category || !domicile || !branch_ids || branch_ids.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Query colleges with cutoffs that the user can get into
    const { data: cutoffs, error } = await supabase
      .from('cutoffs')
      .select(`
        *,
        college_branches!inner(
          *,
          colleges!inner(*),
          branches!inner(*)
        )
      `)
      .eq('category', category)
      .eq('domicile', domicile)
      .in('college_branches.branch_id', branch_ids)
      .lte('closing_percentile', percentile)
      .order('closing_percentile', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Database query failed' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Found ${cutoffs?.length || 0} matching cutoffs`);

    // Process and format the results
    const colleges: College[] = (cutoffs || []).map(cutoff => ({
      college_name: cutoff.college_branches.colleges.college_name,
      branch_name: cutoff.college_branches.branches.branch_name,
      fees_per_year: cutoff.college_branches.fees_per_year || 0,
      closing_percentile: cutoff.closing_percentile,
      location: cutoff.college_branches.colleges.location,
      round_number: cutoff.round_number,
    }));

    // Remove duplicates and sort by closing percentile (descending)
    const uniqueColleges = colleges.filter((college, index, self) => 
      index === self.findIndex(c => 
        c.college_name === college.college_name && 
        c.branch_name === college.branch_name &&
        c.round_number === college.round_number
      )
    ).sort((a, b) => b.closing_percentile - a.closing_percentile);

    console.log(`Returning ${uniqueColleges.length} unique college predictions`);

    return new Response(
      JSON.stringify({ 
        colleges: uniqueColleges,
        total_found: uniqueColleges.length,
        criteria: {
          percentile,
          category,
          domicile,
          branches_searched: branch_ids.length
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Prediction error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});