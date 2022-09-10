import React from "react";
import { Input } from "@chakra-ui/react";
import { Field, Formik } from "formik";
import { useNavigate } from "react-router-dom";

export function QuickSearch() {
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        query: ""
      }}
      onSubmit={({ query }, { resetForm }) => {
        if (query === "") {
          return;
        }

        const params = new URLSearchParams();
        params.set("q", query);
        navigate("/search?"+params.toString());

        resetForm({
          values: {
            query: ""
          }
        });
      }}
    >
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Field
            as={Input}
            id="query"
            name="query"
            placeholder="Search anything"
          />
        </form>
      )}
    </Formik>
  );
}
