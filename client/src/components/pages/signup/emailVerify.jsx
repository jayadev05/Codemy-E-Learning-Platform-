import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function EmailVerify({ formData, setIsModalVisible }) {
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    const handleChange = (index, value) => {
      if (/^\d*$/.test(value)) {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
  
        if (value && index < 5) {
          document.getElementById(`otp-input-${index + 1}`).focus();
        }
      }
    };
  
    const handleKeyDown = (index, e) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    };

    const handleVerify = async () => {
      const otpString = otp.join("");
      
      if (otpString.length !== 6) {
        toast.error("Please enter complete OTP");
        return;
      }

      try {
        setLoading(true);
        
        // Create request payload
        const requestPayload = {
          userName: formData.username,
          fullName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          otp: otpString
        };

       

        const response = await axios.post('http://localhost:3000/user/create', requestPayload);
    
       
          
          toast.success('Account created successfully!');
          setIsModalVisible(false);
          navigate('/login');
        
       
      } catch (error) {
        // Enhanced error logging
        console.error('Full error:', error);
        console.error('Response data:', error.response?.data);
        console.error('Request payload:', requestPayload);
        
        toast.error(error.response?.data?.message || 'Failed to verify OTP');
      } finally {
        setLoading(false);
      }
    };

    const handleResendOTP = async () => {
      try {
        setLoading(true);
        const response = await axios.post('http://localhost:3000/user/sendotp', {
          email: formData.email
        });
        
        if (response.data.success) {
          toast.success('OTP resent successfully!');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to resend OTP');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-2xl font-bold text-center mb-4">OTP Verification</h2>
          <p className="text-center text-gray-600 mb-6">
            Enter the verification code we just sent to your email
          </p>
          <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:border-orange-500 focus:ring focus:ring-orange-200 focus:outline-none"
              />
            ))}
          </div>
          <p className="text-center text-gray-600 mb-6">
            Didn't receive code? {" "}
            <button 
              onClick={handleResendOTP}
              disabled={loading}
              className="text-blue-500 hover:underline focus:outline-none">
              Resend
            </button>
          </p>
          <button 
            onClick={handleVerify}
            disabled={loading}
            className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 focus:outline-none focus:ring focus:ring-orange-200 disabled:bg-orange-300">
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>
    );
}