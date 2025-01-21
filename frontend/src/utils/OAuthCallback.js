import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OAuthCallback = ({ setToken }) => {
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchToken = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const code = queryParams.get("code");

      if (!code) {
        console.error("Authorization code missing");
        return;
      }

      try {
        const response = await axios.post(`${baseUrl}/youtube/auth-callback`, {
          code,
        });
        const { access_token } = response.data;

        setToken(access_token);
        localStorage.setItem("token", access_token);

        navigate("/");
      } catch (err) {
        console.error(
          "Error exchanging code for token:",
          err.response?.data || err.message
        );
      }
    };

    fetchToken();
  }, [setToken, navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white">
            {/* Spinner */}           {" "}
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                  {/* Loading Text */}           {" "}
      <h2 className="text-2xl font-bold capitalize">Loading...</h2>           {" "}
      <p className="mt-2 text-sm text-gray-400">
                        Please wait while we authenticate your account.        
           {" "}
      </p>
             {" "}
    </div>
  );
};

export default OAuthCallback;
