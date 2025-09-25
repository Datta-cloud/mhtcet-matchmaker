import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PredictionForm from '@/components/PredictionForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import Header from '@/components/Header';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  category?: string;
  domicile?: string;
  percentile?: number;
}

interface PredictionResult {
  id: string;
  percentile: number;
  category: string;
  domicile: string;
  predicted_colleges: any;
  created_at: string;
}

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
    fetchPredictions();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch profile data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPredictions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_predictions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPredictions(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch predictions.",
        variant: "destructive",
      });
    }
  };

  const handlePredictionComplete = () => {
    fetchPredictions();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header profile={profile} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              College Prediction
            </h2>
            <PredictionForm 
              profile={profile}
              onPredictionComplete={handlePredictionComplete}
            />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Your Predictions
            </h2>
            <ResultsDisplay predictions={predictions} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;