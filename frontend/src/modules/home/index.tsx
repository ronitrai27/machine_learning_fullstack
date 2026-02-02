// modules/home/index.ts
"use client"; // useQuery is for the client, not server!
import { api } from "@/lib/axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

// Types for the response.
export interface ApiResponse {
  message: string;
  status?: number;
}

export interface LinearV1Response {
  passengers: number;
  predicted_profit: number;
  rmse: number;
  message: string;
}

export interface LogisticV1Response {
  marks: number;
  probability_of_pass: number;
  prediction_label: string;
}

export interface TitanicDTResponse {
  model: string;
  survived: number;
}

export interface TitanicRFResponse {
  model: string;
  survived: number;
}

// Only runs when explicitly called
// Doesn't retry automatically
// Controlled by user action
// Should only happen when user intends it
// Linear Regression (v1) gives results as passengers & predicted_profit
export function useLinearRegV1() {
  return useMutation<LinearV1Response, AxiosError<any>, { passengers: number }>(
    {
      mutationFn: async (data: { passengers: number }) => {
        const response = await api.post("/api/v1/ml/predict", data);
        console.log("Linear Regression response", response.data);

        const result = response.data.data;

        return {
          passengers: result.passengers,
          predicted_profit: result.predicted_profit,
          rmse: result.rmse,
          message: result.message,
        };
      },
      onSuccess: (data) => {
        // Add safety check before calling toFixed
        const profit =
          data.predicted_profit !== undefined
            ? data.predicted_profit.toFixed(2)
            : "0.00";
        toast.success(`Predicted profit: $${profit}`);
      },
      onError: (err: AxiosError<any>) => {
        const errorMessage =
          (err.response?.data as any)?.detail || "Prediction failed"; // FastAPI uses 'detail' for errors
        toast.error(errorMessage);
      },
    },
  );
}

// CLASSIFICATION

export function useLogisticRegV1() {
  return useMutation<LogisticV1Response, AxiosError<any>, { marks: number }>({
    mutationFn: async (data: { marks: number }) => {
      // Backend expects { studentMarks: number } not { marks: number }
      const requestData = { studentMarks: data.marks };

      const response = await api.post("/api/v1/ml/logistic", requestData);
      console.log("Logistic Regression response", response.data);

      // Backend returns { status: "success", data: { ... } }
      const result = response.data.data;

      return {
        marks: result.marks,
        probability_of_pass: result.probability_of_pass,
        prediction_label: result.prediction_label,
      };
    },
    onSuccess: (data) => {
      toast.success(`Prediction: ${data.prediction_label}`);
    },
    onError: (err: AxiosError<any>) => {
      const errorMessage =
        (err.response?.data as any)?.detail || "Prediction failed"; // FastAPI uses 'detail' for errors
      toast.error(errorMessage);
    },
  });
}

export function useTitanicDTV1() {
  return useMutation<
    TitanicDTResponse,
    AxiosError<any>,
    {
      Pclass: number;
      Sex: number;
      Age: number;
      SibSp: number;
      Parch: number;
      Fare: number;
      FamilySize: number;
    }
  >({
    mutationFn: async (data: {
      Pclass: number;
      Sex: number;
      Age: number;
      SibSp: number;
      Parch: number;
      Fare: number;
      FamilySize: number;
    }) => {
      const requestData = {
        Pclass: data.Pclass,
        Sex: data.Sex,
        Age: data.Age,
        SibSp: data.SibSp,
        Parch: data.Parch,
        Fare: data.Fare,
        FamilySize: data.FamilySize,
      };

      const response = await api.post(
        "/api/v1/titanic/decision-tree",
        requestData,
      );
      console.log("Decision Tree response", response.data);

      const result = response.data;

      return {
        model: result.model,
        survived: result.survived,
      };
    },
    onSuccess: (data) => {
      toast.success(`Prediction: ${data.survived}`);
    },
    onError: (err: AxiosError<any>) => {
      const errorMessage =
        (err.response?.data as any)?.detail || "Prediction failed";
      toast.error(errorMessage);
    },
  });
}


export function useTitanicRFV1() {
  return useMutation<
    TitanicRFResponse,
    AxiosError<any>,
    {
      PclassRF: number;
      SexRF: number;
      AgeRF: number;
      SibSpRF: number;
      ParchRF: number;
      FareRF: number;
      FamilySizeRF: number;
    }
  >({
    mutationFn: async (data: {
      PclassRF: number;
      SexRF: number;
      AgeRF: number;
      SibSpRF: number;
      ParchRF: number;
      FareRF: number;
      FamilySizeRF: number;
    }) => {
      const requestData = {
        Pclass: data.PclassRF,
        Sex: data.SexRF,
        Age: data.AgeRF,
        SibSp: data.SibSpRF,
        Parch: data.ParchRF,
        Fare: data.FareRF,
        FamilySize: data.FamilySizeRF,
      };

      const response = await api.post(
        "/api/v1/titanic/random-forest",
        requestData,
      );
      console.log("Random Forest response", response.data);

      const result = response.data;

      return {
        model: result.model,
        survived: result.survived,
      };
    },
    onSuccess: (data) => {
      toast.success(`Prediction: ${data.survived}`);
    },
    onError: (err: AxiosError<any>) => {
      const errorMessage =
        (err.response?.data as any)?.detail || "Prediction failed";
      toast.error(errorMessage);
    },
  });
}