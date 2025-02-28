import { POINTS } from "@/assets/DartGameRessources";
import React from "react";
import {
  Drawer,
  DrawerTrigger,
  Button,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  DrawerFooter,
  DrawerClose,
} from "../ui";

export const Tuto: React.FC = () => {
  return (
    <Drawer direction="top">
      <DrawerTrigger asChild>
        <Button className="mr-3" variant="outline">
          Comment compter les points
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-4">
          <div className="mx-auto w-full max-w-xl">
            <DrawerHeader>
              <DrawerTitle>Les points de la partie de fléchette</DrawerTitle>
              <DrawerDescription>
                Voici les différents points que vous pouvez obtenir lors d'une
                partie de fléchette.
              </DrawerDescription>
            </DrawerHeader>
          </div>
          <div className="flex justify-center overflow-x-auto space-x-4">
            {POINTS.map((point) => (
              <Card key={point.label} className="mb-4 w-58">
                <CardHeader>
                  <CardTitle>{point.label}</CardTitle>
                </CardHeader>
                <CardContent className="px-4">
                  <div className="w-full h-32 sm:h-24 flex items-center justify-center">
                    <img
                      src={point.illustration}
                      alt={point.label}
                      className="object-contain h-full"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-center break-words">{point.description}</p>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mx-auto w-full max-w-sm">
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Fermer</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
