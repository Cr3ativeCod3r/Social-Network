import React, { useState, useEffect } from "react";
import axios from "axios";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_FrontURL + "/getAnn"
        ); // Używamy Axios do pobrania danych
        setAnnouncements(response.data); // Ustawiamy pobrane ogłoszenia w stanie komponentu
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <>
      <div className="flex justify-center items-start mt-4">
        <div className="w-full max-w-xs">
          <label className="flex flex-col">
            <span className="label-text">Szukaj ogłoszenia</span>
            <input
              type="text"
              placeholder="Nazwa..."
              className="input input-bordered"
            />
          </label>
          <div className="flex items-center mt-3">
            <span>Wszystkie</span>
            <input
              type="radio"
              name="radio-1"
              className="radio ml-2 mr-2"
              checked
            />
            <span>Sprzedam</span>
            <input type="radio" name="radio-1" className="radio ml-2 mr-2" />
            <span>Szukam</span>
            <input type="radio" name="radio-1" className="radio ml-2 mr-2" />
          </div>
        </div>
      </div>

      <div className="flex mr-auto ml-auto w-4/5 bg-slate-700 rounded-xl mt-10">
        <div className="w-full flex flex-row flex-wrap mt-10 ml-40">
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="card w-1/3 bg-base-100 shadow-xl "
            >
              <figure>
                <img src={announcement.image} alt={announcement.title} />
              </figure>
              <div className="card-body">
                <h2 className="card-title">
                  {announcement.title}
                  {announcement.new && (
                    <div className="badge badge-secondary">NEW</div>
                  )}
                </h2>
                <p>{announcement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Announcements;
