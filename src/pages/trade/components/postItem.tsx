import { useEffect, useState } from "react";
import { CustomButton } from "@/components/custom-button/custom-button";
import PostDetails from "./postDetails";
import styles from "./steps/steps.module.scss";
import { arrowLeft, chevronRight } from "@/base/SVG";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// third party
import { apiClient } from "@/services/api/client";
import BarLoader from "react-spinners/BarLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// project import

export default function PostItem() {
  const navigate = useNavigate();

  const [categoryList, setCategoryList] = useState([]);

  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [description, setDescription] = useState("");
  const [estimatedValue, setEstimatedValue] = useState("");

  const [shippingWeight, setShippingWeight] = useState("");
  const [shippingDimensions, setShippingDimensions] = useState({
    length: "",
    width: "",
    height: "",
  });

  const [images, setImages] = useState([]);

  const stepConfig = [
    {
      title: "Choose Trade Type",
      buttonText: "Continue",
      showStepNumber: true,
    },
    { title: "Item Details", buttonText: "Continue", showStepNumber: true },
    {
      title: "Step 3 of 6 – Your Information",
      buttonText: "Continue",
      showStepNumber: false,
    },
    {
      title: "Match & Review Trade",
      buttonText: "Continue to Next Step",
      showStepNumber: true,
    },
    {
      title: "Step 5 of 6 – Payment & Shipping Setup",
      buttonText: "Continue to Final Review",
      showStepNumber: false,
    },
    {
      title: "Step 6 of 6 – Final Review & Submit",
      buttonText: "Submit Trade",
      buttonIcon: chevronRight,
      showStepNumber: false,
    },
  ];

  const getCategories = () => {
    apiClient
      .get("/api/trade/interests/")
      .then((response) => {
        const categories = response.data.map((category) => ({
          id: category.id,
          value: `${category.icon || ""} ${category.name}`,
        }));

        setCategoryList(categories);
      })
      .catch((error) => {
        toast.error(error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  useEffect(() => {
    getCategories();
  }, []);

  const postItemFunction = () => {
    apiClient
      .post("/api/trade/items", {
        name: title,
        description: description,
        price: estimatedValue,
        shipping: {
          weight: shippingWeight,
          dimensions: shippingDimensions,
        },
        images: images,
        interests: selectedTags,
      })
      .then((response) => {
        toast.success("Item posted successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        // Redirect to the single item page
        navigate(`/browse/single-item?id=${response.data.item_id}`);
      })
      .catch((error) => {
        toast.error(error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  return (
    <section className={styles["base"]}>
      <div className="auto__container">
        <div className={styles["steps__inner"]}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <PostDetails
              categoryList={categoryList}
              title={title}
              setTitle={setTitle}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              description={description}
              setDescription={setDescription}
              estimatedValue={estimatedValue}
              setEstimatedValue={setEstimatedValue}
              shippingWeight={shippingWeight}
              setShippingWeight={setShippingWeight}
              shippingDimensions={shippingDimensions}
              setShippingDimensions={setShippingDimensions}
              images={images}
              setImages={setImages}
            />
          </motion.div>

          <br />
          <CustomButton
            iconPos="right"
            icon={chevronRight}
            title="Post Item"
            styleType="primary"
            disabled={
              !(
                title &&
                description &&
                estimatedValue &&
                shippingWeight &&
                images.length > 0
              )
            }
            onClick={postItemFunction}
          />
          {!(
            title &&
            description &&
            estimatedValue &&
            shippingWeight &&
            images.length > 0
          ) && (
            <p style={{ color: "red", marginTop: "10px" }}>
              Please fill in all fields before posting your item.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
