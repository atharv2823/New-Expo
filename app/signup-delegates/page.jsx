// Import necessary libraries and styles
"use client";
import React, { useState,useEffect } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import "react-phone-number-input/style.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
//import { FaEye, FaEyeSlash } from "react-icons/fa6";
import CustomTable from "./CustomTable";


import Link from "next/link";

import avlogo from "@/public/avlogo.webp";

// Define the number of days
const numberOfDays = 3;

function filterScheduleData(data) {
  console.log("firs",data)
  return data.reduce((acc, curr) => {
    let existingDate = acc.find((item) => item.date === curr.Date);
    let session = {
      sector: curr.Sector,
      title: curr.Title || "",
      hall: curr.Hall,
      time: "", // Add logic to determine time if needed
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
  });

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

    const { privacyPolicy, receiveUpdates, ...dataToSubmit } = formData;


   
const { data, error } = await supabase
.from('delegates')
.insert([
  { 
    name: 'name',
    company_name: 'company_name',
    number :'number',
    email: 'email',
    city: 'city',
    state: 'state',
    country: 'country',
    sessions: 'sessions',
   },
])
.select()
        
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
      // const { data, error } = await supabase
      //   .from("delegates")
      //   .insert({
      //     ...dataToSubmit,
      //     selectedSessions: selectedSessions,
      //   })
      //   .select();
      if (error) {
        console.log(error);
      } else {
        console.log(data);
       
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
      const { data, error } = await supabase.from("Schedule").select("Date, Time ,Sector, Title, Hall, Speaker");

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
  return(<>

<div className="main">
  <div className="header">
    <Link href="/">
      <Image
        src={avlogo}
        width={180}
        height={180}
        alt="Reacctor World Expo"
      />
    </Link>
  </div>

  <Separator className="my-6" />

  <div className="w-full">
    <CustomTable ScheduleData={ScheduleData}/>
  </div>
  <form className="form" onSubmit={handleSubmit}>
    <div className="lg:text-3xl md:text-lg text-xl font-semibold mt-3 ml-6">
      <h2 className="pb-2">Delegate Registration Form</h2>
      <div className="h-[3px] lg:w-[400px] w-full rounded-t-md bg-gradient-to-r from-[#F9A700] to-[#009951]" />
    </div>
    <Separator className="my-6" />

    {/* Basic Info Section */}
    <div className="container flex gap-56">
      <div className="heading ml-28">
        <h1 className="text-2xl font-bold">Basic Info</h1>
        <div className="bg-gradient-to-r from-[#F9A700] to-[#009951] h-[6px] w-[110px] rounded-t-md" />
      </div>
      <div className="formfields   grid grid-cols-3 gap-10">
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
                      {ScheduleData
                        .filter((day) => formData.selectedDays.includes(day.id))
                        .map((day) => (
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
        <div className="fields ">
          <Label htmlFor="name" className="text-[16px]">
            Name
          </Label>
          <Input
            type="text"
            id="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleNonNumberChange}
            required
          />
        </div>

        {/* Company Name */}
        <div className="fields ">
          <Label htmlFor="company_name" className="text-[16px]">
            Company Name
          </Label>
          <Input
            type="text"
            id="company_name"
            placeholder="Company Name"
            value={formData.company_name}
            onChange={handleNonNumberChange}
            required
          />
        </div>

        {/* Phone Number */}
        <div className="fields">
          <Label htmlFor="phoneNumber" className="text-[16px]">
            Phone Number
          </Label>
          <PhoneInput
            id="phoneNumber"
            international
            defaultCountry="IN"
            placeholder="Enter your Phone Number"
            value={formData.number}
            required
            limitMaxLength
            onChange={(value) =>
              handleInputChange({
                target: { id: "phoneNumber", value },
              })
            }
            className={`flex h-10 w-full rounded-md border border-input ${
              phoneValidation ? "bg-background" : "bg-error"
            } px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
          />
          {!phoneValidation && (
            <p className="text-error text-sm mt-1 text-red-500">
              Phone numbers do not match.
            </p>
          )}
        </div>

        {/* Email */}
        <div className="fields">
          <Label htmlFor="email" className="text-[16px]">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
    </div>

    <Separator className="my-6" />

    {/* Company Details Section */}
    <div className="container grid grid-cols-3">
      <div className="heading ml-28">
        <h1 className="font-bold text-2xl">Address Details</h1>
        <div className="bg-gradient-to-r from-[#F9A700] to-[#009951] h-[6px] w-[200px] rounded-t-md" />
      </div>
      <div className="formfields">
        {/* City */}
        <div className="fields">
          <Label htmlFor="city" className="text-[16px]">
            City
          </Label>
          <Input
            type="text"
            id="city"
            placeholder="Enter your city"
            value={formData.city}
            onChange={handleNonNumberChange}
            required
            maxLength={15}
          />
        </div>

        {/* State */}
        <div className="fields">
          <Label htmlFor="state" className="text-[16px]">
            State
          </Label>
          <Input
            type="text"
            id="state"
            placeholder="Enter Your state"
            value={formData.state}
            onChange={handleNonNumberChange}
            required
            maxLength={15}
          />
        </div>

        {/* Country */}
        <div className="fields">
          <Label htmlFor="country" className="text-[16px]">
            Country
          </Label>
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

    <div className="fields ml-28">
      <Label
        htmlFor="receiveUpdates"
        className="flex items-center text-[16px] mt-2"
      >
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
        Would you like to receive future updates from us?
      </Label>
    </div>

    {/* Privacy Policy Consent */}
    <div className="fields ml-28">
      <Label
        htmlFor="privacyPolicy"
        className="flex items-center text-[16px] mt-2"
      >
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
        By accepting this, you acknowledge that you have read and understood
        this Privacy Policy and agree to its terms and conditions.
      </Label>
    </div>

    {/* Submit Buttons */}
    <div className="submit">
      <Button variant="secondary" type="button" onClick={handleReset}>
        Reset
      </Button>
      <Button type="submit" className="bg-[#F9A700]">
        Submit
      </Button>
    </div>
    <div className="flex lg:justify-end justify-center">
      <Image
        src="/poweredy.png"
        width={170}
        height={170}
        alt="Reacctor World Expo"
      />
    </div>
  </form>
  <ToastContainer />
</div>

  
  </>)

};

export default Page;
