import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { type AxiosError } from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  accountIcon,
  checkTick,
  mailIcon,
  padlockIcon,
  userIcon,
} from "@/base/SVG";
import styles from "../auth.module.scss";
import { CustomButton } from "@/components/custom-button/custom-button";
import { FormField } from "@/components/form-field/form-field";
import { PassField } from "@/components/pass-field/pass-field";
import { SERVER_URL } from "../../config";

interface RegisterResponse {
  token: string;
  message?: string;
}

interface ApiErrorResponse {
  message?: string;
}

export default function SignUp() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [agreesToTerms, setAgreesToTerms] = useState(false);

  useEffect(() => {
    const token = document.cookie.split("; ").find((row) => row.startsWith("token="));
    if (token) {
      window.location.href = "/browse";
    }
  }, []);

  const handleError = (error: AxiosError<ApiErrorResponse> | Error) => {
    const message =
      axios.isAxiosError(error)
        ? error.response?.data?.message ?? "Error occurred. Please try again later."
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

  const extractUsernameFromEmail = (emailValue: string): string => {
    if (emailValue && emailValue.includes("@")) {
      return emailValue.split("@")[0];
    }
    return emailValue;
  };

  const register = async () => {
    if (!agreesToTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    setIsSubmitting(true);

    const username = extractUsernameFromEmail(email);
    document.cookie = `emailForSignUp=${email};max-age=2592000;path=/`;

    try {
      const response = await axios.post<RegisterResponse>(
        `${SERVER_URL}/api/auth/register/`,
        {
          username,
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          password_confirm: passwordConfirm,
          agrees_to_terms: agreesToTerms ? 1 : 0,
        }
      );

      if (response.status === 201 && response.data.token) {
        document.cookie = `token=${response.data.token};max-age=2592000;path=/`;
        navigate("/browse");
        return;
      }

      toast.error(response.data.message ?? "Unable to create account", {
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

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAgreesToTerms(event.target.checked);
  };

  return (
    <div className={styles.form}>
      <div className={styles.form__title}>
        <div className={styles.form__icon}>{accountIcon}</div>
        <h4>Create Account</h4>
        <p>Join TradeShip and start trading today</p>
      </div>
      <div className={styles.form__col}>
        <label className={styles.input__outer}>
          <p>First Name</p>
          <FormField
            placeholder="John"
            type="text"
            icon={userIcon}
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
          />
        </label>
        <label className={styles.input__outer}>
          <p>Last Name</p>
          <FormField
            placeholder="Doe"
            type="text"
            icon={userIcon}
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            required
          />
        </label>
        <label className={styles.input__outer}>
          <p>Email Address</p>
          <FormField
            placeholder="name@example.com"
            type="email"
            icon={mailIcon}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <div className={styles.input__outer}>
          <p>Password</p>
          <PassField
            placeholder="Create a strong password"
            icon={padlockIcon}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <div className={styles.input__outer}>
          <p>Confirm Password</p>
          <PassField
            placeholder="Confirm your password"
            icon={padlockIcon}
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            required
          />
        </div>
        <label className={styles.check}>
          <div className={styles.check__box}>
            <input type="checkbox" checked={agreesToTerms} onChange={handleCheckboxChange} />
            <span>{checkTick}</span>
          </div>
          <p>
            I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
          </p>
        </label>
      </div>
      <div className={styles.form__button}>
        <CustomButton
          title="Create Account"
          styleType="primary"
          iconPos="left"
          icon={accountIcon}
          onClick={register}
          disabled={isSubmitting}
        />
      </div>
      <div className={styles.form__foot}>
        <div className={styles.form__line}>
          <p>Already have an account?</p>
        </div>
        <Link to="/auth/">Sign in here</Link>
      </div>
    </div>
  );
}
