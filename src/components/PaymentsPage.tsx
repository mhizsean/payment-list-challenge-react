import { Container } from "./components";
import { I18N } from "../constants/i18n";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../constants";
import { PaymentSearchResponse } from "../types/payment";
import { formatDate } from "date-fns";

async function fetchPayments(): Promise<PaymentSearchResponse> {
  const res = await fetch(`${API_URL}?page=1&pageSize=5`);
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}

export const PaymentsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: fetchPayments,
  });

  return (
    <Container>
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          {I18N.PAGE_TITLE}
        </h2>
      </div>

      {isLoading && <div>Loading...</div>}

      {data && (
        <div className="overflow-x-auto">
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {data.payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">
                    {payment.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(payment.date, "dd/MM/yyyy, HH:mm:ss")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {(payment.amount, payment.currency)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {payment.customerName || I18N.EMPTY_CUSTOMER}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {payment.currency || I18N.EMPTY_CURRENCY}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="capitalize">{payment.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
};
