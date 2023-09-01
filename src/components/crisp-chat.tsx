"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("6f072dfa-4255-4468-b726-24f26fd4d8cb");
  }, []);

  return null;
};
