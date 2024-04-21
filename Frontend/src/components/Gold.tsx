import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoEnterOutline } from "react-icons/io5";

const Gold = () => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_FrontURL + "/pages"
        );
        setPages(response.data);
      } catch (error) {
        console.error("Error fetching pages:", error);
      }
    };

    fetchPages();
  });

  return (
    <>
      <div
        className="w-full w-2/3 ml-auto mr-auto text-center bg-gray-800 overflow-y-scroll rounded-xl"
        style={{ height: "38vw" }}
      >
        <h1 className="font-bold mt-4 text-3xl">
          Strony na wagę złota dla studenta
        </h1>

        {pages.length > 0 ? (
          pages.map((page, index) => (
            <div
              key={index}
              tabIndex={0}
              className=" collapse shadow-xl  collapse-close border border-base-300 bg-base-200 text-left mt-10 mr-auto ml-auto"
              style={{ width: "95%" }}
            >
              <div className="collapse-title text-xl font-medium justify-center flex ">
                {page.page} - {page.description}{" "}
                <a href={page.link} target="_blank" rel="noopener noreferrer">
                  <IoEnterOutline className="mt-auto mb-auto text-3xl ml-2" />
                </a>
              </div>
            </div>
          ))
        ) : (
          <p>No pages found</p>
        )}
      </div>
    </>
  );
};

export default Gold;
