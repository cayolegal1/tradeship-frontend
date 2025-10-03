import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError, type AxiosError } from "axios";
import { apiClient } from "@/services/api/client";
import BarLoader from "react-spinners/BarLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { logIcon, padlockIcon, userIcon } from "../../base/SVG";
import styles from "../auth.module.scss";
import { CustomButton } from "../../components/custom-button/custom-button";
import { FormField } from "../../components/form-field/form-field";
import { PassField } from "../../components/pass-field/pass-field";

import { AuthResponseDto, UserProfile } from "@/types";

interface ApiErrorResponse {
  message?: string;
}

export default function SignIn() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleError = (error: AxiosError<ApiErrorResponse> | Error) => {
    const message = isAxiosError(error)
      ? error.response?.data?.message ??
        "Error occurred. Please try again later."
      : "Error occurred. Please try again later.";

    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const login = async (userEmail: string, userPassword: string) => {
    setIsSubmitting(true);

    try {
      const response = await apiClient.post<AuthResponseDto>(
        "/api/auth/login/",
        {
          email: userEmail,
          password: userPassword,
        }
      );

      const isLoginSuccessful = response.status === 200 && response.data.tokens?.accessToken;

      if (isLoginSuccessful) {
        navigate("/browse");
        return;
      }

      toast.error(response.data?.message ?? "Unable to sign in", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      handleError(error as AxiosError<ApiErrorResponse>);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        await apiClient.get<UserProfile>("/api/auth/user/");
        if (isMounted) {
          navigate("/browse");
        }
      } catch {
        // ignore unauthenticated state
      }
    };

    void checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={styles.form}>
      <div className={styles.form__title}>
        <div className={styles.form__icon}>{logIcon}</div>
        <h4>Welcome Back</h4>
        <p>Sign in to your TradeShip account</p>
      </div>
      <div className={styles.form__col}>
        <label className={styles.input__outer}>
          <p>Email Address</p>
          <FormField
            placeholder="name@example.com"
            type="email"
            icon={userIcon}
            onChange={handleEmailChange}
            value={email}
            required
          />
        </label>
        <div className={styles.input__outer}>
          <p>Password</p>
          <PassField
            placeholder="Enter your password"
            icon={padlockIcon}
            onChange={handlePasswordChange}
            value={password}
            required
          />
        </div>
      </div>
      <div className={styles.form__forgot}>
        <Link to="#">Forgot your password?</Link>
      </div>
      <div className={styles.form__button}>
        <CustomButton
          onClick={() => login(email, password)}
          title="Sign In"
          styleType="primary"
          disabled={isSubmitting}
          icon={isSubmitting ? <BarLoader color="#fff" width={50} /> : null}
        />
      </div>
      <div className={styles.form__foot}>
        <div className={styles.form__line}>
          <p>Don't have an account?</p>
        </div>
        <Link to="/auth/sign-up">Create your account</Link>
      </div>
    </div>
  );
}


