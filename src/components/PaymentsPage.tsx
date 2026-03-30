import { useState } from "react";
import {
  Container,
  StatusBadge,
  SearchInput,
  SearchButton,
  ClearButton,
  FilterRow,
  ErrorBox,
  Select,
  PaginationRow,
  PaginationButton,
} from "./components";
import { I18N } from "../constants/i18n";
import { useQuery } from "@tanstack/react-query";
import { API_URL, CURRENCIES } from "../constants";
import { PaymentSearchResponse } from "../types/payment";
import { formatDate } from "date-fns";

async function fetchPayments(
  search: string,
  currency: string,
  page: number,
): Promise<PaymentSearchResponse> {
  const params = new URLSearchParams({ page: String(page), pageSize: "5" });
  if (search) params.set("search", search);
  if (currency) params.set("currency", currency);
  const res = await fetch(`${API_URL}?${params}`);
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}

export const PaymentsPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [currency, setCurrency] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["payments", search, currency, page],
    queryFn: () => fetchPayments(search, currency, page),
  });

  const handleSearch = () => {
    setPage(1);
    setSearch(inputValue);
  };

  const handleClear = () => {
    setInputValue("");
    setSearch("");
    setCurrency("");
    setPage(1);
  };

  const hasActiveFilters = search || currency;

  return (
    <Container>
      <div className=" py-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {I18N.PAGE_TITLE}
        </h2>
      </div>

      <FilterRow>
        <SearchInput
          type="text"
          placeholder={I18N.SEARCH_PLACEHOLDER}
          aria-label={I18N.SEARCH_LABEL}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Select
          aria-label={I18N.CURRENCY_FILTER_LABEL}
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="">{I18N.CURRENCIES_OPTION}</option>
          {CURRENCIES.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </Select>
        <SearchButton type="button" onClick={handleSearch}>
          {I18N.SEARCH_BUTTON}
        </SearchButton>

        {hasActiveFilters && (
          <ClearButton type="button" onClick={handleClear}>
            {I18N.CLEAR_FILTERS}
          </ClearButton>
        )}
      </FilterRow>

      {isLoading && <div>Loading...</div>}

      {error && (
        <ErrorBox>
          {error.message === "404"
            ? I18N.PAYMENT_NOT_FOUND
            : I18N.INTERNAL_SERVER_ERROR}
        </ErrorBox>
      )}

      {data && (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  I18N.TABLE_HEADER_PAYMENT_ID,
                  I18N.TABLE_HEADER_DATE,
                  I18N.TABLE_HEADER_AMOUNT,
                  I18N.TABLE_HEADER_CUSTOMER,
                  I18N.TABLE_HEADER_CURRENCY,
                  I18N.TABLE_HEADER_STATUS,
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-md font-semibold capitalize tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-gray-100">
              {data.payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">
                    {payment.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(payment.date, "dd/MM/yyyy, HH:mm:ss")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {payment.customerName || I18N.EMPTY_CUSTOMER}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {payment.currency || I18N.EMPTY_CURRENCY}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={payment.status}>
                      {payment.status}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <PaginationRow>
            <PaginationButton
              type="button"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              {I18N.PREVIOUS_BUTTON}
            </PaginationButton>
            <span>
              {I18N.PAGE_LABEL} {page}
            </span>
            <PaginationButton
              type="button"
              disabled={page >= Math.ceil(data.total / data.pageSize)}
              onClick={() => setPage((prev) => prev + 1)}
            >
              {I18N.NEXT_BUTTON}
            </PaginationButton>
          </PaginationRow>
        </div>
      )}
    </Container>
  );
};
