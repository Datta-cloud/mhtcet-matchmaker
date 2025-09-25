import React from 'react';

interface College {
  college_name: string;
  branch_name: string;
  fees_per_year: number;
  closing_percentile: number;
  location: string;
  round_number: number;
}

interface PredictionResult {
  id: string;
  percentile: number;
  category: string;
  domicile: string;
  predicted_colleges: College[];
  created_at: string;
}

interface ResultsDisplayProps {
  predictions: PredictionResult[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ predictions }) => {
  if (predictions.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-center text-muted-foreground">
          <p>No predictions yet. Fill out the form to get college recommendations!</p>
        </div>
      </div>
    );
  }

  const latestPrediction = predictions[0];

  return (
    <div className="space-y-6">
      {/* Latest Prediction Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Latest Prediction Results
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-sm text-muted-foreground">Percentile:</span>
            <p className="font-medium text-foreground">{latestPrediction.percentile}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Category:</span>
            <p className="font-medium text-foreground">{latestPrediction.category}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Domicile:</span>
            <p className="font-medium text-foreground">{latestPrediction.domicile}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Colleges Found:</span>
            <p className="font-medium text-foreground">
              {latestPrediction.predicted_colleges?.length || 0}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Generated on {new Date(latestPrediction.created_at).toLocaleString()}
        </p>
      </div>

      {/* College Results */}
      {latestPrediction.predicted_colleges && latestPrediction.predicted_colleges.length > 0 ? (
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="text-lg font-semibold text-foreground mb-4">
            Recommended Colleges
          </h4>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {latestPrediction.predicted_colleges.map((college, index) => (
              <div
                key={index}
                className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-semibold text-foreground text-sm">
                    {college.college_name}
                  </h5>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    Round {college.round_number}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {college.branch_name}
                </p>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <p className="text-foreground">{college.location}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Closing Percentile:</span>
                    <p className="text-foreground">{college.closing_percentile}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Annual Fees:</span>
                    <p className="text-foreground">
                      ₹{college.fees_per_year?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-center text-muted-foreground">
            <p>No colleges found matching your criteria. Try adjusting your preferences.</p>
          </div>
        </div>
      )}

      {/* Previous Predictions */}
      {predictions.length > 1 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="text-lg font-semibold text-foreground mb-4">
            Previous Predictions
          </h4>
          <div className="space-y-3">
            {predictions.slice(1, 6).map((prediction) => (
              <div key={prediction.id} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                <div>
                  <span className="text-sm font-medium text-foreground">
                    Percentile: {prediction.percentile}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {prediction.category} • {prediction.domicile}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">
                    {prediction.predicted_colleges?.length || 0} colleges
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(prediction.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;