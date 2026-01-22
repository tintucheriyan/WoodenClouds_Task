import { useEffect, useState } from "react";
import "./Registration.css";

const Registration = () => {
  const [step, setStep] = useState(1);

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    email: "",
    gender: "",
    address: "",
    country: "",
    city: "",
  });

  const [errors, setErrors] = useState({});

 
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name")
      .then(res => res.json())
      .then(data => {
        const names = data.map(c => c.name.common).sort();
        setCountries(names);
      })
      .catch(() => alert("Failed to load countries"));
  }, []);

 
  useEffect(() => {
    if (!formData.country) return;

    fetch("https://countriesnow.space/api/v0.1/countries/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: formData.country }),
    })
      .then(res => res.json())
      .then(data => setCities(data.data))
      .catch(() => alert("Failed to load cities"));
  }, [formData.country]);

 
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "country") {
      setFormData({ ...formData, country: value, city: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateStep1 = () => {
    let err = {};
    if (!formData.fullName) err.fullName = "Name required";
    if (!formData.email) err.email = "Email required";
    if (!formData.dob) err.dob = "DOB required";
    if (!formData.gender) err.gender = "Gender required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };
  const validateStep2 = () => {
    let err = {};
    if (!formData.address) err.address = "Address required";
    if (!formData.country) err.country = "Country required";
    if (!formData.city) err.city = "City required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  return (
    <div>
      <h2>Registration</h2>
      <p>Step {step}</p>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <input name="fullName" placeholder="Name" onChange={handleChange} />
          <p>{errors.fullName}</p>

          <input type="date" name="dob" onChange={handleChange} />
          <p>{errors.dob}</p>

          <input name="email" placeholder="Email" onChange={handleChange} />
          <p>{errors.email}</p>

          <label>
            <input type="radio" name="gender" value="Male" onChange={handleChange}/> Male
          </label>
          <label>
            <input type="radio" name="gender" value="Female" onChange={handleChange}/> Female
          </label>
          <p>{errors.gender}</p>

          <button onClick={() => validateStep1() && setStep(2)}>Next</button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <input name="address" placeholder="Address" onChange={handleChange} />
          <p>{errors.address}</p>

          <select name="country" onChange={handleChange}>
            <option value="">Select Country</option>
            {countries.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <p>{errors.country}</p>

          <select name="city" onChange={handleChange} disabled={!formData.country}>
            <option value="">Select City</option>
            {cities.map(city => (
              <option key={city}>{city}</option>
            ))}
          </select>
          <p>{errors.city}</p>

          <button onClick={() => setStep(1)}>Back</button>
          <button onClick={() => validateStep2() && setStep(3)}>Next</button>
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
          <button onClick={() => setStep(2)}>Back</button>
          <button onClick={() => alert("Form Submitted!")}>Submit</button>
        </>
      )}
    </div>
  );
};

export default Registration;