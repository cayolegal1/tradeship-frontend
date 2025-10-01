import classNames from "classnames";
import {
  checkIcon,
  clockIcon,
  cubeIcon,
  deliveredIcon,
  flagIcon,
  shieldIcon,
  totalIcon,
} from "@/base/SVG";
import styles from "../my-trades.module.scss";

import { CustomButton } from "@/components/custom-button/custom-button";
import { useNavigate } from "react-router-dom";
import { mainList } from "@/constants/modul";

export default function Main() {
  return (
    <div className={styles["main"]}>
      {mainList.map((item, index) => {
        return <Item {...item} key={index} />;
      })}
    </div>
  );
}
const Item = (props) => {
  const navigate = useNavigate("");
  return (
    <div className={styles["item"]}>
      <div className={styles["itemHead"]}>
        <div className={styles["itemHead__row"]}>
          <div className={styles["itemHead__title"]}>
            <h3>{props.title}</h3>
            {props.type === "quick" && (
              <div
                className={classNames(
                  styles["itemHead__type"],
                  styles["quick"]
                )}
              >
                {cubeIcon}
                Quick
              </div>
            )}
            {props.type === "vault" && (
              <div
                className={classNames(
                  styles["itemHead__type"],
                  styles["vault"]
                )}
              >
                {shieldIcon}
                Vault
              </div>
            )}
          </div>
          <>
            {props.status === "pending" && (
              <div
                className={classNames(
                  styles["itemHead__status"],
                  styles[props.status]
                )}
              >
                {clockIcon}
                Pending Acceptance
              </div>
            )}
            {props.status === "transit" && (
              <div
                className={classNames(
                  styles["itemHead__status"],
                  styles[props.status]
                )}
              >
                {totalIcon}
                In Transit
              </div>
            )}
            {props.status === "completed" && (
              <div
                className={classNames(
                  styles["itemHead__status"],
                  styles[props.status]
                )}
              >
                {checkIcon}
                Completed
              </div>
            )}
            {props.status === "delivered" && (
              <div
                className={classNames(
                  styles["itemHead__status"],
                  styles[props.status]
                )}
              >
                {deliveredIcon}
                Delivered
              </div>
            )}
            {props.status === "dispute" && (
              <div
                className={classNames(
                  styles["itemHead__status"],
                  styles[props.status]
                )}
              >
                {flagIcon}
                Dispute Open
              </div>
            )}
          </>
        </div>
        <div className={styles["itemHead__row"]}>
          <div className={styles["itemHead__date"]}>
            <p>Started: {props.date}</p>
          </div>
          <div className={styles["itemHead__partner"]}>
            <p>With:</p>
            <span>
              <img src={props.avatar} alt="avatar" />
            </span>
            <p>{props.partner}</p>
          </div>
        </div>
      </div>
      <div className={styles["itemMain"]}>
        {props.card.map((item, index) => {
          return (
            <div className={styles["itemCard"]} {...item} key={index}>
              <div className={styles["itemCard__title"]}>
                <p>{item.title}</p>
              </div>
              <div className={styles["itemCard__row"]}>
                <div className={styles["itemCard__image"]}>
                  <img src={item.image} alt="image" />
                </div>
                <div className={styles["itemCard__name"]}>
                  <h6>{item.name}</h6>
                  <p>{item.price}</p>
                  {item.add && (
                    <div className={styles["itemCard__add"]}>{item.add}</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles["itemFoot"]}>
        <div className={styles["itemFoot__details"]}>
          <CustomButton
            size="sm"
            title="View Details"
            styleType="primary"
            onClick={() => navigate("/trade/trade-summary")}
          />
        </div>
        <div className={styles["itemFoot__buttons"]}>
          {props.status === "pending" && (
            <CustomButton size="sm" title="View Offer" styleType="solid" />
          )}
          {props.status === "transit" && (
            <CustomButton
              size="sm"
              title="Track Delivery"
              styleType="solid"
              onClick={() => navigate("/trade/delivery-tracking")}
            />
          )}
          {props.status === "completed" && (
            <CustomButton
              size="sm"
              iconPos="left"
              title="Something Went Wrong?"
              styleType="solid"
              icon={flagIcon}
            />
          )}
          {props.status === "delivered" && (
            <>
              <CustomButton
                size="sm"
                title="Confirm Delivery"
                styleType="solid"
                onClick={() => navigate("/trade/labels")}
              />
              <CustomButton
                size="sm"
                iconPos="left"
                title="Something Went Wrong?"
                styleType="solid"
                icon={flagIcon}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
