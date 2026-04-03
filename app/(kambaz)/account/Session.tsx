"use client";
import * as client from "./client";
import { useEffect, type ReactNode } from "react";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";

export default function Session({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = await client.profile();
        dispatch(setCurrentUser(currentUser));
      } catch (err: unknown) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [dispatch]);
  return <>{children}</>;
}
