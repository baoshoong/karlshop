import { AddressElement } from "@stripe/react-stripe-js";
import React from "react";

const AddressForm = ({ onAddressChange }: { onAddressChange: (address: any) => void }) => {
  return (
    <form>
      <h3 className="text-lg font-semibold mb-2">📦 Địa chỉ giao hàng</h3>
      <AddressElement
        options={{ mode: "shipping" }}
        onChange={(event) => {
          if (event.complete && event.value?.address) {
            onAddressChange(event.value.address); // Gửi địa chỉ ra ngoài
          }
        }}
      />
      <p className="text-sm text-gray-500 mt-2">
        * Vui lòng điền đầy đủ địa chỉ để chúng tôi có thể giao hàng chính xác.
      </p>
    </form>
  );
};

export default AddressForm;
