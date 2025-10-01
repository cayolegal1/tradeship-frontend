import { useEffect, useState } from "react";
import { energyIcon, vaultIcon } from "../../../base/SVG";
import classNames from "classnames";
import { filterIcon, searchIcon, starIcon } from "@/base/SVG";
import { CustomButton } from "@/components/custom-button/custom-button";
import styles from "../browse.module.scss";
import { Link } from "react-router-dom";
import CustomSelect from "@/components/custom-select/custom-select";

// third party
import axios from "axios";
import BarLoader from "react-spinners/BarLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// project import
import { SERVER_URL } from "../../../config";

export default function BrowseItems() {
  const [categoryList, setCategoryList] = useState([
    {
      id: "0",
      value: "All Interests",
    },
  ]);
  const orderByList = [
    {
      id: "1",
      value: "Order By Relevance",
    },
    {
      id: "2",
      value: "Order By Price (High to Low)",
    },
    {
      id: "3",
      value: "Order By Price (Low to High)",
    },
    {
      id: "4",
      value: "Order By Newest",
    },
    {
      id: "5",
      value: "Order By Oldest",
    },
  ];

  const tradeTypeList = [
    {
      id: "0",
      value: "All Trade Types",
    },
    {
      id: "1",
      value: "Only Quick Trades",
    },
    {
      id: "2",
      value: "Only Vault Trades",
    },
  ];

  const [loaded, setLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [allItemsLoaded, setAllItemsLoaded] = useState(false);
  const [itemsPerPage] = useState(50);
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="));

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryList[0]);
  const [selectedTradeType, setSelectedTradeType] = useState(tradeTypeList[0]);
  const [selectedOrderBy, setSelectedOrderBy] = useState(orderByList[0]);

  const [loadingItems, setLoadingItems] = useState(false);

  const getItems = (page) => {
    setLoadingItems(true);

    axios
      .get(
        SERVER_URL +
          "/api/trade/items/?page=" +
          page +
          "&limit=" +
          itemsPerPage +
          "&search=" +
          searchQuery +
          "&category=" +
          selectedCategory.id +
          "&trade_type=" +
          selectedTradeType.id +
          "&order_by=" +
          selectedOrderBy.id,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log({ response });
        //setItems(response.data);
        // Add to items array
        setItems((prevItems) => [...prevItems, ...response.data.results]);
        // If the response data is less than itemsPerPage, it means there are no more items to load
        if (response.data.results.length < itemsPerPage) {
          setAllItemsLoaded(true);
        }

        setLoaded(true);
        setLoadingItems(false);
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

  const getCategories = () => {
    axios
      .get(SERVER_URL + "/api/trade/interests/", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log({ response });
        const categories = response.data.results.map((category) => ({
          id: category.id,
          value: /*category.icon + " " + */ category.name,
        }));
        setCategoryList((prevCategories) => [...prevCategories, ...categories]);
      })
      .catch((error) => {
        console.log(error);
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
    if (categoryList.length > 1) {
      // If categories are already loaded, no need to fetch again
      return;
    }

    getCategories();
  }, []);

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (categoryList.length < 2) {
      // If categories are not loaded yet, do not fetch items
      return;
    }

    // Reset items and pagination when search query or filters change
    setLoaded(false);
    setItems([]);
    setAllItemsLoaded(false);

    // Wait for the user to finish typing before fetching items
    const delayDebounceFn = setTimeout(() => {
      if (currentPage > 1) {
        setCurrentPage(1); // Reset to first page and trigger new fetch
      } else {
        getItems(1); // Fetch items for the first page
      }
    }, 1000); // Adjust the delay as needed
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedCategory, selectedTradeType, selectedOrderBy]);

  // Handle scroll event to load more items
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight * 0.6 &&
        !allItemsLoaded
      ) {
        // Load more items when scrolled to the bottom
        if (loadingItems) return; // Prevent multiple requests
        if (items.length === 0) return; // Don't load more if no items are loaded

        // Wait for the next page to load before incrementing
        const delayDebounceFn = setTimeout(() => {
          setCurrentPage((prevPage) => prevPage + 1);
        }, 1000); // Adjust the delay as needed
        return () => clearTimeout(delayDebounceFn);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [allItemsLoaded]);

  return (
    <section className={styles["browse"]}>
      <pre>{JSON.stringify(items, null, 4)}</pre>
      <div className="auto__container">
        <div className={styles["browse__inner"]}>
          <div className={styles["browse__inner-title"]}>
            <h3>Browse Items</h3>
            <p>Discover items worth trading from trusted traders</p>
          </div>
          <div className={styles["filter"]}>
            <div className={styles["filter__row"]}>
              <div className={styles["filter__search"]}>
                <span>{searchIcon}</span>
                <input
                  type="search"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className={styles["filter__select"]}>
                <CustomSelect
                  list={categoryList}
                  selected={selectedCategory}
                  onChange={setSelectedCategory}
                />
              </div>
              <div className={styles["filter__select"]}>
                <CustomSelect
                  list={tradeTypeList}
                  selected={selectedTradeType}
                  onChange={setSelectedTradeType}
                />
              </div>
              <div className={styles["filter__select"]}>
                <CustomSelect
                  list={orderByList}
                  selected={selectedOrderBy}
                  onChange={setSelectedOrderBy}
                />
              </div>
            </div>
          </div>
          <div className={styles["browse__inner-info"]}>
            <p>Showing {items.length} items</p>
            <button type="button" className={styles["filterBtn"]}>
              <span>{filterIcon}</span>
              More Filters
            </button>
          </div>
          <div className={styles["browse__inner-row"]}>
            {!loaded && (
              <BarLoader
                color="#209999"
                cssOverride={{
                  display: "block",
                  margin: "10vh auto",
                  borderColor: "red",
                }}
              />
            )}
            {items.length === 0 && loaded && (
              <div className={styles["browse__no-items"]}>
                <h4>No items found</h4>
                <p>Try changing your search criteria or filters.</p>
              </div>
            )}
            {items.map((item, index) => {
              return <BrowseItem {...item} key={index} />;
            })}
          </div>
          <div className={styles["browse__inner-foot"]}>
            {/* attention */}
            {allItemsLoaded && items.length > 0 ? (
              <div className={styles["browse__inner-foot-warning"]}>
                <p>All items loaded. No more items to load.</p>
              </div>
            ) : (
              <CustomButton
                title="Load More Items"
                styleType="secondary"
                onClick={() => {
                  setCurrentPage(currentPage + 1);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
const BrowseItem = (props) => {
  return (
    <Link
      to={"/browse/single-item?id=" + props.id}
      className={styles["browseItem"]}
    >
      <div className={styles["browseItem__image"]}>
        <img
          src={
            SERVER_URL +
            "/item-images/" +
            (props.preview_image_path || "").trim()
          }
          alt="placeholder"
        />
      </div>
      <div className={styles["browseItem__content"]}>
        <div className={styles["browseItem__top"]}>
          <h5>{props.name}</h5>
          {props.trade_type != undefined && (
            <div
              className={classNames(styles["browseItem__status"], {
                [styles.quick]: props.trade_type === "Quick",
              })}
            >
              {props.trade_type === "Quick" ? (
                <span>{energyIcon}</span>
              ) : (
                <span>{vaultIcon}</span>
              )}
              {props.trade_type}
            </div>
          )}
        </div>
        <div className={styles["browseItem__text"]}>
          <p>{props.description}</p>
        </div>
        <div className={styles["browseItem__row"]}>
          <div className={styles["browseItem__price"]}>
            {props.estimatedValue} $
          </div>
          {props.interests.length > 0 &&
            props.interests
              .split(",")
              .filter((tag) => tag.trim() !== "")
              .slice(0, 1) // Limit to 1 tag
              .map((tag, index) => (
                <div className={styles["browseItem__field"]}>
                  <span key={index}>{tag.trim()}</span>
                </div>
              ))}
        </div>
        <div className={styles["browseItem__row"]}>
          <div className={styles["browseItem__profile"]}>
            <span>
              <img
                src={
                  SERVER_URL +
                  (props.owner_profile_pic || "/profiles/default.png")
                }
                alt="avatar"
              />
            </span>
            <p>{props.ownerUsername}</p>
          </div>
          <div className={styles["browseItem__rate"]}>
            <span>{starIcon}</span>
            <b>{props.average_rating || 0}</b>
            <p>({props.review_count} Trades)</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
