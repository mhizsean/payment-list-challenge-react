import React from "react";
import { Container } from "./components";
import { I18N } from "../constants/i18n";

export const PaymentsPage = () => {
  return (
    <Container>
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          {I18N.PAGE_TITLE}
        </h2>
      </div>
    </Container>
  );
};
