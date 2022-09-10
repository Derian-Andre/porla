import React from "react";
import { useTranslation } from "react-i18next";
import Card from "../components/Card";

export default function Home() {
  const { t } = useTranslation();

  return (
    <Card heading={t("overview")}>
      Porla!
    </Card>
  )
}
