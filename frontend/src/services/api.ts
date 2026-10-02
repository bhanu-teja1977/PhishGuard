import { useState, useEffect } from 'react'

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface TopFactor {
  feature: string;
  magnitude: number;
  direction: string;
  explanation: string;
}

export interface AnalyzeResponse {
  url: string;
  prediction: number;
  classification: string;
  phishing_probability: number;
  risk_score: number;
  risk_level: string;
  top_factors: TopFactor[];
  features: Record<string, any>;
}

export const analyzeUrl = async (url: string): Promise<AnalyzeResponse> => {
  const res = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to analyze URL');
  }
  return res.json();
};

export const getModels = async () => {
  const res = await fetch(`${API_BASE_URL}/models`);
  if (!res.ok) throw new Error('Failed to load models');
  return res.json();
};

export const getMetrics = async () => {
  const res = await fetch(`${API_BASE_URL}/metrics`);
  if (!res.ok) throw new Error('Failed to load metrics');
  return res.json();
};

export const getDataset = async () => {
  const res = await fetch(`${API_BASE_URL}/dataset`);
  if (!res.ok) throw new Error('Failed to load dataset');
  return res.json();
};
