import React from "react";

const Card = ({ title, children }) => (
  <div className="bg-white shadow rounded p-4 mb-4">
    <h2 className="text-lg font-bold mb-2">{title}</h2>
    {children}
  </div>
);

export default Card;
