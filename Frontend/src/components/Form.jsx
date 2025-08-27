import React from "react";

const Form = ({ onSubmit, children }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    {children}
    <button type="submit" className="btn btn-primary">Submit</button>
  </form>
);

export default Form;
