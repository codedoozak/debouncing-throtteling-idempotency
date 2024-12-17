import { createFileRoute } from "@tanstack/react-router";
import React from "react";

type Props = {};

export const Route = createFileRoute("/wallet")({
  component: RouteComponent,
});
function RouteComponent(props: Props) {
  const hanldePayment = () => {
    fetch("http://localhost:8000/api/wallet-idempotent", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ idempotencyKey: "key123", amount: 100 }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      Wallet
      <div>
        <button
          onClick={() => {
            hanldePayment();
          }}
        >
          Pay 1000${" "}
        </button>
      </div>
    </div>
  );
}
