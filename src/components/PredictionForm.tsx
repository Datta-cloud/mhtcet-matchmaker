import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  category?: string;
  domicile?: string;
  percentile?: number;
}

interface Branch {
  id: string;
  branch_name: string;
  branch_code: string;
}

interface PredictionFormProps {
  profile: Profile | null;
  onPredictionComplete: () => void;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ profile, onPredictionComplete }) => {
  const [percentile, setPercentile] = useState(profile?.percentile?.toString() || '');
  const [category, setCategory] = useState(profile?.category || '');
  const [domicile, setDomicile] = useState(profile?.domicile || '');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .order('branch_name');

      if (error) throw error;
      setBranches(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch branches.",
        variant: "destructive",
      });
    }
  };

  const handleBranchToggle = (branchId: string) => {
    setSelectedBranches(prev => 
      prev.includes(branchId)
        ? prev.filter(id => id !== branchId)
        : [...prev, branchId]
    );
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!percentile || !category || !domicile) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (selectedBranches.length === 0) {
      toast({
        title: "No Branches Selected",
        description: "Please select at least one branch.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Update profile with current data
      await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          full_name: profile?.full_name || '',
          email: profile?.email || '',
          category,
          domicile,
          percentile: parseFloat(percentile),
        });

      // Call prediction edge function
      const { data, error } = await supabase.functions.invoke('predict-colleges', {
        body: {
          percentile: parseFloat(percentile),
          category,
          domicile,
          branch_ids: selectedBranches,
        }
      });

      if (error) throw error;

      // Save prediction result
      await supabase
        .from('user_predictions')
        .insert({
          user_id: user.id,
          percentile: parseFloat(percentile),
          category,
          domicile,
          predicted_colleges: data.colleges,
        });

      toast({
        title: "Prediction Complete!",
        description: `Found ${data.colleges?.length || 0} colleges for your criteria.`,
      });

      onPredictionComplete();
    } catch (error: any) {
      toast({
        title: "Prediction Failed",
        description: error.message || "An error occurred during prediction.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <form onSubmit={handlePredict} className="space-y-6">
        <div>
          <label htmlFor="percentile" className="block text-sm font-medium text-foreground mb-2">
            MHTCET Percentile *
          </label>
          <input
            id="percentile"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={percentile}
            onChange={(e) => setPercentile(e.target.value)}
            required
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter your percentile"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
            Category *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select Category</option>
            <option value="OPEN">Open</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="OBC">OBC</option>
            <option value="EWS">EWS</option>
          </select>
        </div>

        <div>
          <label htmlFor="domicile" className="block text-sm font-medium text-foreground mb-2">
            Domicile *
          </label>
          <select
            id="domicile"
            value={domicile}
            onChange={(e) => setDomicile(e.target.value)}
            required
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select Domicile</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Other State">Other State</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Select Branches *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto border border-input rounded-md p-3">
            {branches.map((branch) => (
              <label key={branch.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBranches.includes(branch.id)}
                  onChange={() => handleBranchToggle(branch.id)}
                  className="rounded border-input text-primary focus:ring-ring"
                />
                <span className="text-sm text-foreground">
                  {branch.branch_name} ({branch.branch_code})
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 font-medium"
        >
          {loading ? 'Predicting...' : 'Predict Colleges'}
        </button>
      </form>
    </div>
  );
};

export default PredictionForm;