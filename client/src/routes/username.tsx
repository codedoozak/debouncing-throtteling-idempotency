import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { debounce } from "../utils/functions";


export const Route = createFileRoute("/username")({
  component: RouteComponent,
});

function RouteComponent() {
  const [username, setUsername] = useState("");
  const [response, setResponse] = useState<null | {
    exists: boolean;
    username: string;
  }>(null);

  const [isLoading, setISLoading] = useState(false);
  const [errUsername, setErrUsername] = useState<any>(null);
  const checkUserName = useCallback((proposedUsername: string) => {
    setISLoading(true);
    setErrUsername(null);
    axios
    .post("http://localhost:8000/api/username-check", {
      username: proposedUsername,
    })
    .then((res) => {
      console.log(res);
      setResponse(res.data);
      setISLoading(false);
      setErrUsername(null);
      })
      .catch((err) => {
        setErrUsername(err.response.data.error);
        console.log(err.response.data.error);
        setISLoading(false);
        setResponse(null);
      });
  }, []);



  const debouncedCheckUserName = useCallback( debounce(checkUserName, 600) , [checkUserName , debounce])

  console.log(response);

  return (
    <div className="mx-auto px-3 py-3 w-max">
      <h3 className="font-semibold"> Choose your user name </h3>
      <input
        onChange={(e) => {
          setUsername(e.target.value);
          debouncedCheckUserName(e.target.value);
          //checkUserName(e.target.value);
         }}
        placeholder="write username"
        value={username}
        className={twMerge(
          "border border-solid  rounded-md my-2 py-1 px-2",
          ` ${response?.exists === true ? "border-red-500 text-red-500" : ""}
        ${response?.exists === false ? "border-green-500 text-green-500" : ""}
        ${isLoading && "!text-black !border-black"}
         `
        )}
      />

      {isLoading ? (
        <p className="mb-3">Loading...</p>
      ) : (
        <p
          className={` mb-3    ${
            response?.exists
              ? "text-red-500 font-semibold"
              : "text-green-500 font-semibold"
          }`}
        >
          {response?.username}{" "}
        </p>
      )}
      {errUsername && (
        <p className="my-3 border border-b-red-500 bg-red-300 text-red-800">
          {errUsername}
        </p>
      )}
      <button className="bg-indigo-600 text-white ">Submit</button>
    </div>
  );
}
