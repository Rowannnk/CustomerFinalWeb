"use client";
import * as React from "react";
import CustomerList from "./components/CustomerList";

export default function HomeV2() {
  return (
    <main>
      <div className="w-full h-full my-10 mx-10">
        <h1 className="font-bold text-xl">Stock App</h1>
        <p>Simple stock management</p>
        <CustomerList />
      </div>
    </main>
  );
}
