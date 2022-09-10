import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import Card from "../components/Card";
import { trpc } from "../utils/trpc";

export default function Search() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState();

  const query = searchParams.get("q") || "";
  const search = trpc.useQuery(["search.all", { query }]);

  return (
    <>
      <Card heading="Search">
        {JSON.stringify(search.data)}
      </Card>
    </>
  );
}
