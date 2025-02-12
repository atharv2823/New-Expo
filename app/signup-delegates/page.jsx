// Import necessary libraries and styles
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import "react-phone-number-input/style.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Select from "react-select";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import countryNames from "./../../data/countires.js";
import supabase from "@/supabase/config";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import CustomTable from "./CustomTable";
import logo from "@/public/RWE.png";

import Link from "next/link";

import avlogo from "@/public/avlogo.webp";
import { Speaker } from "lucide-react";

// Define the number of days
const numberOfDays = 3;

function filterScheduleData(data) {
  console.log("Data", data);
  return data.reduce((acc, curr) => {
    let existingDate = acc.find((item) => item.date === curr.Date);
    let session = {
      sector: curr.Sector,
      title: curr.Title || "",
      hall: curr.Hall,
      speaker: curr.Speaker,
      time: curr.Time,
    };

    if (existingDate) {
      existingDate.sessions.push(session);
    } else {
      acc.push({
        date: curr.Date,
        id: acc.length + 1,
        sessions: [session],
      });
    }
    return acc;
  }, []);
}

// Create a functional component
const Page = () => {
  // Generate an array of days
  const days = Array.from({ length: numberOfDays }, (_, index) => index + 1);

  // Function to reset the form data
  const handleReset = () => {
    window.location.reload();
  };

  // Initialize the form data and validation state using state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company_name: "",
    selectedDays: [],
    number: "",
    isWhatsAppNumber: "",
    whatsappNumber: "",
    city: "",
    state: "",
    country: "",
    receiveUpdates: "",
    privacyPolicy:"",
  });
  console.log("Sending formData:", formData);
 

  const [selectedSessions, setSelectedSessions] = useState([]);
  // console.log("selectedSessions", selectedSessions);

  const handleDayChange = (dayId) => {
    formData.selectedDays((prev) =>
      prev.includes(dayId)
        ? prev.filter((id) => id !== dayId)
        : [...prev, dayId]
    );
  };

  const handleSessionChange = (sessionTitle) => {
    setSelectedSessions((prev) =>
      prev.includes(sessionTitle)
        ? prev.filter((title) => title !== sessionTitle)
        : [...prev, sessionTitle]
    );
  };

  const disabledInputStyle = {
    backgroundColor: "#F6F6F7",
  };

  // Initialize validation states
  const [phoneValidation, setPhoneValidation] = useState(true);
  const [emailValidation, setEmailValidation] = useState(true);
  const [passwordValidation, setPasswordValidation] = useState(true);
  const [isWhatsappDisabled, setIsWhatsappDisabled] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const handleCaptchaVerify = (token) => {
    // Here, you can verify the token with your server if needed.
    // For simplicity, we're just setting the verification status to true.
    setIsCaptchaVerified(true);
  };

  // Function to handle checkbox changes
  const handleCheckboxChange = (day) => {
    const { selectedDays } = formData;
    if (selectedDays.includes(day)) {
      // If the day is already selected, remove it from the selectedDays array
      setFormData({
        ...formData,
        selectedDays: selectedDays.filter((d) => d !== day),
      });
    } else {
      // If the day is not selected, add it to the selectedDays array
      setFormData({
        ...formData,
        selectedDays: [...selectedDays, day],
      });
    }
  };

  const handleCategory = (selectedOption) => {
    setFormData({
      ...formData,
      category: selectedOption.value,
    });
  };

  // options for country
  const optionsCountry = countryNames.map((country) => ({
    value: country,
    label: country,
  }));

  const handleCountryChange = (selectedOption) => {
    setFormData({
      ...formData,
      country: selectedOption.value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(!submitted);

    if (!formData.privacyPolicy) {
      toast.error("Please accept the Privacy Policy to proceed.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setDisableBtn(false);
      
      return;
    }
    

    const { privacyPolicy, receiveUpdates, name ,company_name ,email , number , city , state, country ,sessions} = formData;

    const { data, error } = await supabase
      .from("delegates")
      .insert([
        {
          name,
          company_name,
          number,
          email,
          city,
          state,
          country,
          sessions: JSON.stringify(selectedSessions),
        },
        
      ])
      .select();
      


    if (error) {
      // console.error;
    } else if (data.length > 0) {
      toast.warn("You have already signed up.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      const { data, error } = await supabase
        .from("delegates")
        .insert({
          ...dataToSubmit,
          selectedSessions: selectedSessions,
        })
        .select();
      if (error) {
        console.log(error);
      } else {
        console.log("Delegate registered successfully:", data);

        setTimeout(() => {
          router.push(`./thankyou?id=${data[0].id}`);
        }, 2000);
        setSubmitted(!submitted);
      }
    }
  };

  // Function to handle input field changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  function isTextValid(text) {
    // Allow only alphabetic characters (A-Z, a-z) and spaces
    return /^[A-Za-z\s]+$/.test(text);
  }

  const handlePaste = (e) => {
    e.preventDefault();
  };

 const handleNonNumberChange = (e) => {
    const { id, value } = e.target;

    if (isTextValid(value) || value === "") {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  }; 

// const handleNonNumberChange = (e) => {
//   const { id, value } = e.target;

//   if (isTextValid(value) || value === "") {
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [id]: value,
//     }));
//   }
// };


  const router = useRouter();

  const [visible, setVisible] = useState(false);

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setVisible(!visible);
  };

  const [ScheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      const { data, error } = await supabase
        .from("Schedule")
        .select("Date, Time ,Sector, Title, Hall, Speaker");

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        const filteredData = filterScheduleData(data);
        setScheduleData(filteredData);
        console.log("Filtered Data", filteredData);
      }
      setLoading(false);
    };

    fetchSchedule();
  }, []);

  // Return the JSX for the component
  return (
    <>
      <div className="main  max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="header border-2 rounded-2xl mb-6 mt-2 flex justify-center">
          <Link href="/">
            <Image
              src={avlogo}
              width={150}
              height={150}
              alt="Reacctor World Expo"
              className="p-3"
            />
          </Link>
        </div>

        {/* Table Section */}
        <div className="w-full mb-8">
          <CustomTable ScheduleData={ScheduleData} />
        </div>

        {/* Delegate Registration Form */}
        <form
          className="form p-6 border-2 rounded-2xl shadow-md bg-white"
          onSubmit={handleSubmit}
        >
          {/* Form Heading */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold">Delegate Registration Form</h2>
            <div className="h-[3px] w-[250px] mx-auto bg-gradient-to-r from-[#F9A700] to-[#009951]" />
          </div>

          <Separator className="my-6" />

          {/* Basic Info Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-2">Basic Info</h3>
            <div className="h-[4px] w-[120px] bg-gradient-to-r from-[#F9A700] to-[#009951] rounded-t-md mb-4" />

            {/* Grid Layout for Form Fields */}
            <div className="grid lg:grid-cols-3 gap-x-8 gap-y-6">
              {/* Days */}

              <div className="days">
                <div className="heading">
                  <h1>Select Day</h1>
                </div>
                <div className="checkbox grid grid-cols-3 gap-6">
                  {days.map((day) => (
                    <div key={day} className="box">
                      <input
                        type="checkbox"
                        id={`day${day}`}
                        name={`day${day}`}
                        checked={formData.selectedDays.includes(day)}
                        onChange={() => handleCheckboxChange(day)}
                      />
                      <label
                        htmlFor={`day${day}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[16px]"
                      >
                        Day {day}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {formData.selectedDays.length > 0 && (
                <div className="h-[200px] lg:w-[400px] overflow-scroll">
                  <div className="mb-4">
                    <label className="block font-bold mb-2">
                      Select Sessions:
                    </label>
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-2 text-left">Select</th>
                          <th className="border p-2 text-left">Sector</th>
                          <th className="border p-2 text-left">Title</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ScheduleData.filter((day) =>
                          formData.selectedDays.includes(day.id)
                        ).map((day) => (
                          <React.Fragment key={day.id}>
                            <tr className="bg-gray-200">
                              <td
                                colSpan="3"
                                className="border p-2 font-semibold"
                              >
                                {day.date}
                              </td>
                            </tr>
                            {day.sessions.map((session, index) => (
                              <tr key={index} className="border">
                                <td className="border p-2">
                                  <input
                                    type="checkbox"
                                    checked={selectedSessions.includes(
                                      session.title
                                    )}
                                    onChange={() =>
                                      handleSessionChange(session.title)
                                    }
                                    className="mr-2"
                                  />
                                </td>
                                <td className="border p-2">{session.sector}</td>
                                <td className="border p-2">
                                  {session.title || "N/A"}
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Name */}
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleNonNumberChange}
                  required
                />
              </div>

              {/* Company Name */}
              <div>
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  type="text"
                  id="company_name"
                  placeholder="Enter your company name"
                  value={formData.company_name}
                  onChange={handleNonNumberChange}
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="number">Phone Number</Label>
                <PhoneInput
                  id="number"
                  international
                  defaultCountry="IN"
                  placeholder="Enter your Phone Number"
                  value={formData.number}
                  required
                  limitMaxLength
                  onChange={(value) =>
                    handleInputChange({ target: { id: "number", value } })
                  }
                  className={`border rounded-md p-2 ${
                    phoneValidation ? "bg-white" : "bg-red-100"
                  }`}
                />
                {!phoneValidation && (
                  <p className="text-red-500 text-sm mt-1">
                    Phone numbers do not match.
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Address Details Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-2">Address Details</h3>
            <div className="h-[4px] w-[150px] bg-gradient-to-r from-[#F9A700] to-[#009951] rounded-t-md mb-4" />

            <div className="grid lg:grid-cols-3 gap-x-8 gap-y-6">
              {/* City */}
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  type="text"
                  id="city"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={handleNonNumberChange}
                  required
                />
              </div>

              {/* State */}
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  type="text"
                  id="state"
                  placeholder="Enter your state"
                  value={formData.state}
                  onChange={handleNonNumberChange}
                  required
                />
              </div>

              {/* Country */}
              <div>
                <Label htmlFor="country">Country</Label>
                <Select
                  options={optionsCountry}
                  value={optionsCountry.find(
                    (options) => options.value === formData.country
                  )}
                  onChange={handleCountryChange}
                  required
                />
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Privacy & Consent */}
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="receiveUpdates"
                checked={formData.receiveUpdates}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    receiveUpdates: e.target.checked,
                  }))
                }
                className="mr-2"
              />
              <Label htmlFor="receiveUpdates">
                Would you like to receive future updates from us?
              </Label>
            </div>

            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="privacyPolicy"
                checked={formData.privacyPolicy}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    privacyPolicy: e.target.checked,
                  }))
                }
                required
                className="mr-2"
              />
              <Label htmlFor="privacyPolicy">
                By accepting this, you acknowledge that you have read and
                understood this Privacy Policy and agree to its terms and
                conditions.
              </Label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-center mt-6">
            <div className="flex w-96 justify-between">
              <Button
                variant="secondary"
                type="button"
                onClick={handleReset}
                className="w-36 border"
              >
                Reset
              </Button>
              <Button type="submit" className="bg-[#F9A700] w-36">
                Submit
              </Button>
            </div>
          </div>

          {/* Footer Logo */}
          <div className="flex lg:justify-end justify-center mt-6">
            <Image src={logo} width={170} height={170} alt="World Expo" />
          </div>
        </form>

        <ToastContainer />
      </div>
    </>
  );
};

export default Page;
