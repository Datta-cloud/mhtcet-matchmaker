import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  category?: string;
  domicile?: string;
  percentile?: number;
}

interface HeaderProps {
  profile: Profile | null;
}

const Header: React.FC<HeaderProps> = ({ profile }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been logged out successfully.",
      });
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-foreground">
              MHTCET Predictor
            </h1>
            <div className="hidden md:block text-muted-foreground">
              Find the best colleges for your percentile
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {profile && (
              <div className="text-right">
                <div className="font-medium text-foreground">
                  {profile.full_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {profile.email}
                </div>
              </div>
            )}
            
            <button
              onClick={handleSignOut}
              className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;