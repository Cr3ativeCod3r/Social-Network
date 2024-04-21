import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imie: "",
    nazwisko: "",
    email: "",
    haslo: "",
    nick: "",
    uczelnia: "",
    kierunek: "",
    rok: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isValid = Object.values(formData).every(
      (value) => value.trim() !== ""
    );
    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      setLoading(true);
      try {
        const { data } = await axios.post(
          import.meta.env.VITE_FrontURL + `/register`,
          formData
        );

        setSuccess(data.message);

        setFormData({
          imie: "",
          nazwisko: "",
          email: "",
          haslo: "",
          nick: "",
          uczelnia: "",
          kierunek: "",
          rok: "",
        });

        setTimeout(function () {
          location.reload();
        }, 2000);
      } catch (error) {
        setError(error.response?.data.message || "Wystąpił błąd");
      }
    } else {
      alert("Proszę wypełnić wszystkie pola formularza.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1 p-4">
      {Object.entries(formData).map(([key, value]) => {
        if (key === "uczelnia") {
          return (
            <div key={key} className="form-control">
              <label className="label capitalize">{key}</label>
              <select
                name={key}
                value={value}
                onChange={handleChange}
                required
                className="select select-bordered w-full max-w-xs"
              >
                <option value="">Wybierz uczelnię</option>
                <option value="Uczelnia1">UMCS</option>
                <option value="Uczelnia2">KUL</option>
                <option value="Uczelnia3">POLLUB</option>
                <option value="Uczelnia4">UMED</option>
                <option value="Uczelnia5">UP</option>
                <option value="Uczelnia6">WSEI</option>
                <option value="Uczelnia7">COLLEGIUM HUMANUM</option>
                <option value="Uczelnia8">ANS</option>
                <option value="Uczelnia9">ANSiM</option>
              </select>
            </div>
          );
        } else if (key === "rok") {
          return (
            <div key={key} className="form-control">
              <label className="label capitalize">{key}</label>
              <select
                name={key}
                value={value}
                onChange={handleChange}
                required
                className="select select-bordered w-full max-w-xs"
              >
                <option value="">Wybierz rok studiów</option>
                {[1, 2, 3, 4, 5, 6].map((rok) => (
                  <option key={rok} value={rok}>
                    {rok}
                  </option>
                ))}
              </select>
            </div>
          );
        } else {
          return (
            <div key={key} className="form-control">
              <label className="label capitalize">{key}</label>
              <input
                type={
                  key === "Email"
                    ? "email"
                    : key === "Hasło"
                    ? "password"
                    : "text"
                }
                name={key}
                value={value}
                onChange={handleChange}
                required
                className="input input-bordered w-full max-w-xs"
              />
            </div>
          );
        }
      })}
      <button
        type="submit"
        disabled={!isFormValid}
        className="btn btn-primary mt-10 w-80"
      >
        Zarejestruj
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}

export default Register;
