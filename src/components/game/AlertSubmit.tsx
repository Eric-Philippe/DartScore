import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui";
import { AlertCircle } from "lucide-react";

export const AlertSubmit: React.FC = () => {
  return (
    <Alert variant="default" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Prochain round</AlertTitle>
      <AlertDescription>
        Les points ont été ajoutés avec succès.
      </AlertDescription>
    </Alert>
  );
};
