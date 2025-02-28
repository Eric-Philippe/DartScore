import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Input,
  Label,
  Separator,
  Badge,
} from "@/components/ui";
import { MULTIPLIER } from "@/assets/DartGameRessources";

interface DetailedInputTabProps {
  scores: number[];
  multipliers: string[];
  gameEnded: boolean;
  handleInputChange: (value: string, index: number) => void;
  handleSelectChange: (index: number, value: string) => void;
}

const DetailedInputTab: React.FC<DetailedInputTabProps> = ({
  scores,
  multipliers,
  gameEnded,
  handleInputChange,
  handleSelectChange,
}) => {
  return (
    <div>
      {[0, 1, 2].map((index) => (
        <div key={index} className="mb-4">
          <h2 className="text-l font-bold tracking-tighter">
            Fléchette {index + 1} -
          </h2>
          <div className="flex items-center space-x-4">
            <div className="w-3/4">
              <Label className="mt-4">Score</Label>
              <Input
                className="py-6"
                placeholder="Entrer le score"
                disabled={gameEnded}
                value={scores[index] != 0 ? scores[index] : ""}
                type="number"
                max={60}
                min={0}
                onChange={(e) => handleInputChange(e.target.value, index)}
              />
            </div>
            <div>
              <Label className="mt-4">Multiplicateur</Label>
              <Select
                disabled={gameEnded}
                value={multipliers[index] as string}
                onValueChange={(value) => handleSelectChange(index, value)}
              >
                <SelectTrigger className="py-6">
                  <SelectValue placeholder="Sélectionner la zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Multiplicateur</SelectLabel>
                    {MULTIPLIER.map((multiplier) => (
                      <SelectItem
                        key={multiplier.value}
                        value={multiplier.value}
                      >
                        <Badge>{multiplier.badge}</Badge>
                        {multiplier.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Separator className="my-3" />
        </div>
      ))}
    </div>
  );
};

export default DetailedInputTab;
