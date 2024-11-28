import { createFileRoute } from "@tanstack/react-router";
import imgSrc from "../assets/falafel.jpg";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useDebounce } from "@uidotdev/usehooks";
export const Route = createFileRoute("/sandwich")({
  component: RouteComponent,
});

function RouteComponent() {
  const [options, setOptions] = useState([]);
  const debouncedOptions=useDebounce(options , 600)
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toggleOption = (opt) => {
    setOptions((prev) => {
      const index = prev.indexOf(opt);
      if (index === -1) {
        return [...prev, opt];
      } else {
        return prev.filter((item) => item !== opt);
      }
    });
  };

  const updatePrice = useCallback(async (options) => {
    setResponse(null);
    setIsLoading(true);
    axios
      .post("http://localhost:8000/api/falafel", {
        options: options,
      })
      .then((res) => {
        console.log(res);
        setIsLoading(false);
        setResponse(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
        setResponse(null);
        console.log(err);
      });
  }, [axios]);

  //this is not a good way to send http-request
  useEffect(() => {
    updatePrice(debouncedOptions);
  }, [debouncedOptions, updatePrice]);

  console.log(options);

  return (
    <>
      <></>
      <div>
        <img
          alt="falafel"
          width={250}
          height={250}
          className="mx-auto my-3  rounded-lg border-8 border-solid border-yellow-500 "
          src={imgSrc}
        />
        <div className="shadow-xl p-3 max-w-max mx-auto rounded-lg">
          <h2 className="mb-6 text-center font-semibold border-b-2 bg-gray-800 border-b-solid border-orange-600 w-max mx-auto rounded-lg px-4 text-orange-600">
            Choose Options
          </h2>
          <div className="flex justify-center items-center flex-wrap">
            {[
              { name: "extra-bread", label: "extra bread" },
              { name: "mushroom", label: "mushroom" },
              { name: "cheese", label: "cheese" },
              { name: "extra-falafel", label: "extra falafel" },
              { name: "sauce", label: "sauce" },
              { name: "drink", label: "drink" },
              { name: "french-fries", label: "french fries" },
            ].map((el: any) => {
              return (
                <OptionElement
                  isDisabled={isLoading}
                  isSelected={options.includes(el.name)}
                  label={el.name}
                  name={el.name}
                  onClick={toggleOption}
                />
              );
            })}
          </div>
        </div>
        {isLoading && (
          <div className="text-2xl text-center my-3">loading... </div>
        )}
        {response && (
          <Checkout
            price={response.totalPrice}
            selectedOptionsWithPrice={response.selectedOptions}
          />
        )}
      </div>
    </>
  );
}

const OptionElement = ({ onClick, name, label, isSelected, isDisabled }) => {
  return (
    <span
      role="none"
      className={`mx-3 p-3 my-3  rounded-full cursor-pointer ${isSelected ? "bg-yellow-200 scale-105" : "border border-solid border-yellow-200"} ${isDisabled ? "!cursor-not-allowed opacity-40" : ""}`}
      onClick={() => {
        if (!isDisabled) {
          onClick(name);
        }
      }}
    >
      {label}
    </span>
  );
};

const Checkout = ({ selectedOptionsWithPrice, price }) => {
  return (
    <div className="mx-auto shadow-2xl p-4 w-max mt-8">
      {/* {JSON.stringify(selectedOptionsWithPrice)} */}

      <div className="mx-12 flex justify-center items-center flex-wrap">
        {selectedOptionsWithPrice.map((item) => {
          return (
            <div key={item.item} className="w-full shrink-0">
              <span className="font-semibold">{item.item}</span>
              <span className="text-gray-700"> : {item.price}</span>
            </div>
          );
        })}
      </div>
      <div className="bg-black w-full h-[2px] mt-4"></div>
      <div className="w-full text-center text-3xl">
        Total Price : <span className="text-red-500">{price}</span>{" "}
      </div>
    </div>
  );
};
