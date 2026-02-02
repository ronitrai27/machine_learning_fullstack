"use client";
import React, { useState } from "react";
import {
  useLinearRegV1,
  useLogisticRegV1,
  useTitanicDTV1,
  useTitanicRFV1,
} from "@/modules/home";
import { MODELS } from "@/modules/home/static";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, LucideBot, Search } from "lucide-react";
import ThemeButton from "@/modules/home/ThemeButton";
import { toast } from "sonner";

interface FormValues {
  passengers: number;
}

interface FormValuesTitanic {
  Pclass: number;
  Sex: number;
  Age: number;
  SibSp: number;
  Parch: number;
  Fare: number;
  FamilySize: number;
}

const Home = () => {
  // Linear Regression
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  // Logiistic Regression

  const [marks, setMarks] = useState<number>(0);
  const [search, setSearch] = useState("");

  // states for DT
  const [Pclass, setPclass] = useState<number>(0);
  const [Sex, setSex] = useState<number>(0);
  const [Age, setAge] = useState<number>(0);
  const [SibSp, setSibSp] = useState<number>(0);
  const [Parch, setParch] = useState<number>(0);
  const [Fare, setFare] = useState<number>(0);
  const [FamilySize, setFamilySize] = useState<number>(0);

  // states for RF
  const [PclassRF, setPclassRF] = useState<number>(0);
  const [SexRF, setSexRF] = useState<number>(0);
  const [AgeRF, setAgeRF] = useState<number>(0);
  const [SibSpRF, setSibSpRF] = useState<number>(0);
  const [ParchRF, setParchRF] = useState<number>(0);
  const [FareRF, setFareRF] = useState<number>(0);
  const [FamilySizeRF, setFamilySizeRF] = useState<number>(0);

  const filteredModels = MODELS.filter(
    (model) =>
      model.name.toLowerCase().includes(search.toLowerCase()) ||
      model.category.toLowerCase().includes(search.toLowerCase()),
    // model.description.toLowerCase().includes(search.toLowerCase()),
  );

  const predictMutation = useLinearRegV1();
  const predictLogistic = useLogisticRegV1();
  const predictDT = useTitanicDTV1();
  const predictRF = useTitanicRFV1();

  const onSubmit = (data: FormValues) => {
    predictMutation.mutate(data);
  };

  const onSubmit2 = (data: number) => {
    setMarks(data);
    predictLogistic.mutate({ marks: data });
  };

  const onSubmitDT = () => {
    // if (
    //   Age === 0 ||
    //   Fare === 0 ||
    //   FamilySize === 0 ||
    //   Parch === 0 ||
    //   Pclass === 0 ||
    //   SibSp === 0 ||
    //   Sex === 0
    // ) {
    //   toast.info("Please fill all the fields");
    //   return;
    // }
    predictDT.mutate({
      Age,
      Fare,
      FamilySize,
      Parch,
      Pclass,
      SibSp,
      Sex,
    });
  };

  const onSubmitRF = () => {
    // if (
    //   AgeRF === 0 ||
    //   FareRF === 0 ||
    //   FamilySizeRF === 0 ||
    //   ParchRF === 0 ||
    //   PclassRF === 0 ||
    //   SibSpRF === 0 ||
    //   SexRF === 0
    // ) {
    //   toast.info("Please fill all the fields");
    //   return;
    // }
    predictRF.mutate({
      AgeRF,
      FareRF,
      FamilySizeRF,
      ParchRF,
      PclassRF,
      SibSpRF,
      SexRF,
    });
  };

  return (
    <div className="px-6 py-4">
      <div className="flex w-full justify-end  ">
        <ThemeButton />
      </div>
      <div className="w-full h-auto flex flex-col items-center justify-center">
        <h1 className="text-4xl font-semibold mb-2 text-center">
          Machine Learning Models <LucideBot className="inline ml-2 size-9" />
        </h1>
        <h3 className="text-base text-muted-foreground font-medium  mb-8 text-center ">
          A full-stack ML application powered by FastAPI for backend and serving
          ML models. Nextjs for frontend.
        </h3>

        {/* Search bar with the button to display the model on UI  */}
        <div className="w-full flex items-center justify-center gap-4 mb-8">
          <Input
            type="text"
            placeholder="Search models (e.g. 'linear', 'supervised')..."
            className="w-full max-w-lg focus-visible:ring-muted shadow transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            className="px-6! shadow-md hover:shadow-lg transition-all"
            size="sm"
          >
            Search <Search className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* MODELS GRID */}
        <div className="w-full px-8 pb-12">
          {filteredModels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2  gap-20">
              {filteredModels.map((model) => (
                <div
                  key={model.id}
                  className="transition-all transform opacity-100 scale-100 animate-in fade-in zoom-in-95 duration-500"
                >
                  {model.id === "linear-regression" && (
                    <Card className="h-full shadow-md flex flex-col">
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold flex items-center gap-2">
                          <span className="w-2 h-7 bg-blue-600 rounded-full" />
                          {model.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {model.description}
                        </p>
                      </CardHeader>
                      <CardContent className="grow">
                        <form
                          onSubmit={handleSubmit(onSubmit)}
                          className="space-y-6"
                        >
                          <div className="space-y-3">
                            <Label
                              htmlFor="passengers"
                              className="text-sm font-medium tracking-wider text-muted-foreground"
                            >
                              Passenger Volume
                            </Label>
                            <div className="flex items-center gap-3">
                              <div className="relative grow">
                                <Input
                                  id="passengers"
                                  type="number"
                                  placeholder="e.g. 500"
                                  {...register("passengers", {
                                    required: "Please enter passenger number",
                                    min: {
                                      value: 1,
                                      message: "Must be at least 1",
                                    },
                                    valueAsNumber: true,
                                  })}
                                  className={`h-9 text-lg transition-all ${
                                    errors.passengers
                                      ? "border-red-500 focus-visible:ring-red-500"
                                      : "focus-visible:ring-0"
                                  }`}
                                />
                              </div>
                              <Button
                                disabled={predictMutation.isPending}
                                type="submit"
                                className="px-5 transition-all hover:scale-105 active:scale-95 disabled:scale-100 shadow-sm"
                              >
                                {predictMutation.isPending ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  "Predict"
                                )}
                              </Button>
                            </div>
                            {errors.passengers && (
                              <p className="text-sm text-red-500 font-medium animate-pulse">
                                {errors.passengers.message}
                              </p>
                            )}
                          </div>
                        </form>
                      </CardContent>
                      <CardFooter className="flex flex-col items-stretch pt-2 pb-4">
                        <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-6" />
                        {!predictMutation.isSuccess &&
                          !predictMutation.isPending &&
                          !predictMutation.isError && (
                            <div className="text-center p-4 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl">
                              <p className="text-sm text-slate-400 italic">
                                Results will appear here
                              </p>
                            </div>
                          )}
                        {predictMutation.isPending && (
                          <div className="flex flex-col items-center py-6 space-y-4">
                            <div className="relative w-12 h-12">
                              <div className="absolute inset-0 border-4 border-blue-100 dark:border-blue-900 rounded-full" />
                              <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin" />
                            </div>
                          </div>
                        )}
                        {predictMutation.isSuccess && (
                          <div className="w-full animate-in slide-in-from-bottom-2 duration-500">
                            <div className="p-4 rounded-lg bg-linear-to-br from-blue-500 to-blue-700 text-white shadow-lg relative overflow-hidden">
                              <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">
                                Estimated Profit
                              </p>
                              <h2 className="text-2xl font-black">
                                $
                                {predictMutation.data?.predicted_profit?.toLocaleString(
                                  undefined,
                                  { minimumFractionDigits: 2 },
                                )}
                              </h2>
                            </div>
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  )}

                  {model.id === "logistic-regression" && (
                    <Card className="h-full shadow-md flex flex-col">
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold flex items-center gap-2">
                          <span className="w-2 h-7 bg-orange-600 rounded-full" />
                          {model.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {model.description}
                        </p>
                      </CardHeader>
                      <CardContent className="grow">
                        <div className="space-y-3">
                          <Label
                            htmlFor="marks"
                            className="text-sm font-medium tracking-wider text-muted-foreground"
                          >
                            Student Marks
                          </Label>
                          <div className="flex items-center gap-3">
                            <div className="relative grow">
                              <Input
                                id="marks"
                                type="number"
                                placeholder="e.g. 50"
                                value={marks}
                                onChange={(e) =>
                                  setMarks(Number(e.target.value))
                                }
                                className="h-9 text-lg transition-all"
                              />
                            </div>
                            <Button
                              disabled={predictLogistic.isPending}
                              onClick={() => onSubmit2(marks)}
                              className="px-5 transition-all hover:scale-105 active:scale-95 disabled:scale-100 shadow-sm"
                            >
                              {predictLogistic.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                "Predict"
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col items-stretch pt-2 pb-4">
                        <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-6" />
                        {!predictLogistic.isSuccess &&
                          !predictLogistic.isPending &&
                          !predictLogistic.isError && (
                            <div className="text-center p-4 border-2 border-dashed border-accent dark:border-slate-800 rounded-xl">
                              <p className="text-sm text-muted-foreground italic">
                                Results will appear here
                              </p>
                            </div>
                          )}
                        {predictLogistic.isSuccess && (
                          <div className="w-full animate-in slide-in-from-bottom-2 duration-500">
                            <div className="p-4 rounded-lg bg-linear-to-br from-orange-500 to-orange-700 text-white shadow-lg relative overflow-hidden">
                              <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">
                                Result
                              </p>
                              <h2 className="text-2xl font-black">
                                {predictLogistic.data.prediction_label}
                              </h2>
                            </div>
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  )}

                  {model.id === "titanic-dt" && (
                    <Card className="h-full shadow-md flex flex-col">
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold flex items-center gap-2">
                          <span className="w-2 h-7 bg-lime-400 rounded-full" />
                          {model.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {model.description}
                        </p>
                      </CardHeader>
                      <CardContent className="grow">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Pclass (1-3)</Label>
                            <Input type="number" placeholder="1" value={Pclass} onChange={(e) => setPclass(Number(e.target.value))} className="h-8" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Sex (0=M, 1=F)</Label>
                            <Input type="number" placeholder="0" value={Sex} onChange={(e) => setSex(Number(e.target.value))} className="h-8" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Age</Label>
                            <Input type="number" placeholder="25" value={Age} onChange={(e) => setAge(Number(e.target.value))} className="h-8" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">SibSp</Label>
                            <Input type="number" placeholder="0" value={SibSp} onChange={(e) => setSibSp(Number(e.target.value))} className="h-8" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Parch</Label>
                            <Input type="number" placeholder="0" value={Parch} onChange={(e) => setParch(Number(e.target.value))} className="h-8" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Fare</Label>
                            <Input type="number" placeholder="7.25" value={Fare} onChange={(e) => setFare(Number(e.target.value))} className="h-8" />
                          </div>
                          <div className="space-y-1 col-span-2">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Family Size</Label>
                            <Input type="number" placeholder="1" value={FamilySize} onChange={(e) => setFamilySize(Number(e.target.value))} className="h-8" />
                          </div>
                        </div>
                        <Button
                          disabled={predictDT.isPending}
                          onClick={onSubmitDT}
                          className="w-full mt-4 h-9 bg-lime-500 hover:bg-lime-600 text-white"
                        >
                          {predictDT.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Predict Survival"}
                        </Button>
                      </CardContent>
                      <CardFooter className="flex flex-col items-stretch pt-2 pb-4">
                        <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-6" />
                        {!predictDT.isSuccess &&
                          !predictDT.isPending &&
                          !predictDT.isError && (
                            <div className="text-center p-4 border-2 border-dashed border-accent dark:border-slate-800 rounded-xl">
                              <p className="text-sm text-muted-foreground italic">
                                Results will appear here
                              </p>
                            </div>
                          )}
                        {predictDT.isSuccess && (
                          <div className="w-full animate-in slide-in-from-bottom-2 duration-500">
                            <div className={`p-4 rounded-lg bg-linear-to-br ${predictDT.data?.survived === 1 ? 'from-green-500 to-green-700' : 'from-red-500 to-red-700'} text-white shadow-lg relative overflow-hidden`}>
                              <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">
                                Survival Prediction
                              </p>
                              <h2 className="text-2xl font-black">
                                {predictDT.data?.survived === 1 ? "SURVIVED" : "DEAD"}
                              </h2>
                            </div>
                          </div>
                        )}

                        {predictDT.isError && (
                          <div className="w-full animate-in slide-in-from-bottom-2 duration-500">
                            <div className="p-4 rounded-lg bg-red-100/30  relative overflow-hidden">
                              <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                                Error
                              </p>
                              <h2 className="text-base font-light">
                                {predictDT.error?.message}
                              </h2>
                            </div>
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  )}

                  {model.id === "titanic-rf" && (
                    <Card className="h-full shadow-md flex flex-col">
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold flex items-center gap-2">
                          <span className="w-2 h-7 bg-green-600 rounded-full" />
                          {model.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {model.description}
                        </p>
                      </CardHeader>
                      <CardContent className="grow">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Pclass (1-3)</Label>
                            <Input type="number" placeholder="1" value={PclassRF} onChange={(e) => setPclassRF(Number(e.target.value))} className="h-8" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Sex (0=M, 1=F)</Label>
                            <Input type="number" placeholder="0" value={SexRF} onChange={(e) => setSexRF(Number(e.target.value))} className="h-8" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Age</Label>
                            <Input type="number" placeholder="25" value={AgeRF} onChange={(e) => setAgeRF(Number(e.target.value))} className="h-8" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">SibSp</Label>
                            <Input type="number" placeholder="0" value={SibSpRF} onChange={(e) => setSibSpRF(Number(e.target.value))} className="h-8" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Parch</Label>
                            <Input type="number" placeholder="0" value={ParchRF} onChange={(e) => setParchRF(Number(e.target.value))} className="h-8" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Fare</Label>
                            <Input type="number" placeholder="7.25" value={FareRF} onChange={(e) => setFareRF(Number(e.target.value))} className="h-8" />
                          </div>
                          <div className="space-y-1 col-span-2">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Family Size</Label>
                            <Input type="number" placeholder="1" value={FamilySizeRF} onChange={(e) => setFamilySizeRF(Number(e.target.value))} className="h-8" />
                          </div>
                        </div>
                        <Button
                          disabled={predictRF.isPending}
                          onClick={onSubmitRF}
                          className="w-full mt-4 h-9 bg-green-600 hover:bg-green-700 text-white"
                        >
                          {predictRF.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Predict Survival"}
                        </Button>
                      </CardContent>
                      <CardFooter className="flex flex-col items-stretch pt-2 pb-4">
                        <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-6" />
                        {!predictRF.isSuccess &&
                          !predictRF.isPending &&
                          !predictRF.isError && (
                            <div className="text-center p-4 border-2 border-dashed border-accent dark:border-slate-800 rounded-xl">
                              <p className="text-sm text-muted-foreground italic">
                                Results will appear here
                              </p>
                            </div>
                          )}
                        {predictRF.isSuccess && (
                          <div className="w-full animate-in slide-in-from-bottom-2 duration-500">
                            <div className={`p-4 rounded-lg bg-linear-to-br ${predictRF.data?.survived === 1 ? 'from-green-500 to-green-700' : 'from-red-500 to-red-700'} text-white shadow-lg relative overflow-hidden`}>
                              <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">
                                Survival Prediction
                              </p>
                              <h2 className="text-2xl font-black">
                                {predictRF.data?.survived === 1 ? "SURVIVED" : "DEAD"}
                              </h2>
                            </div>
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full py-20 flex flex-col items-center justify-center text-muted-foreground animate-in fade-in zoom-in-95 duration-500">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-xl font-medium">
                No models found for "{search}"
              </p>
              <p className="text-sm">
                Try searching for "supervised" or "regression"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
