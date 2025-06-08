import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gomart | E-commerce template",
  description: "This is Home for Gomart Template",
  // other metadata
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}
