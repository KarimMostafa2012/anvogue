import React from "react";
import * as Icon from "@phosphor-icons/react/dist/ssr";

interface RateProps {
  currentRate: number | undefined | string;
  size: number;
  onRateSelect?: (rate: number) => void; // Optional callback
}

const Rate: React.FC<RateProps> = ({
  currentRate,
  size,
  onRateSelect,
}) => {
  const stars = [];

  for (let i = 0; i < 5; i++) {
    const filled = i < Number(currentRate);
    const color = filled ? "#ECB018" : "#9FA09C";

    stars.push(
      <button
        key={i}
        type="button"
        disabled={onRateSelect ? false : true}
        onClick={() => onRateSelect?.(i + 1)}
        className="p-0 m-0 bg-transparent border-none outline-none cursor-pointer disabled:cursor-default"
      >
        <Icon.Star size={size} color={color} weight="fill" />
      </button>
    );
  }

  return <div className="rate flex gap-0.5">{stars}</div>;
};

export default Rate;
