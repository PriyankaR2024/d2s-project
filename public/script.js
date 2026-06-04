async function handleSignup(e) {
    e.preventDefault();
  
    const fullName = document.getElementById("username").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;
  
    // Validation
    if (fullName === "") {
      alert("Please enter your full name.");
      return;
    }
  
    const phoneRegex = /^[1-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
  
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(password)) {
      alert("Password must have:\n- At least 6 characters\n- One uppercase\n- One lowercase\n- One number\n- One special character");
      return;
    }
  
    let licenseNumber = "", vehicleType = "", vehicleNumber = "";
  
    if (role === 'Driver') {
      licenseNumber = document.getElementById("licenseNumber").value.trim();
      vehicleType = document.getElementById("vehicleType").value.trim();
      vehicleNumber = document.getElementById("vehicleNumber").value.trim();
  
      if (!licenseNumber || !vehicleType || !vehicleNumber) {
        alert("Please fill in all driver details.");
        return;
      }
    }
  
    const formData = {
      username: fullName,
      phone,
      email,
      password,
      role,
      licenseNumber,
      vehicleType,
      vehicleNumber
    };
  
    try {
      const res = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
  
      const result = await res.json();
      console.log("Signup Response:", result);
  
      if (res.ok) {
        alert("Signup successful! Your ID: " + result.userId);
      

        localStorage.setItem("userId", result.userId);
        localStorage.setItem("role", result.role);


        window.location.href = "index.html";
        
      } else {
        alert(result.message || "Signup failed.");
      }
  
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Something went wrong. Please try again.");
    }
  }
  
