// toastConfig.tsx
import React from "react";
import { BaseToast, ToastConfig } from "react-native-toast-message";
import Svg, { Path } from "react-native-svg";

export const toastConfig = () => {
  success: ({ text1, ...rest }) => (
    <BaseToast
      {...rest}
      style={{ borderLeftColor: "#0078DB", minHeight: 60 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1={text1}
      renderLeadingIcon={() => (
        <Svg width="18" height="13" viewBox="0 0 18 13" fill="none">
          <Path
            d="M6.54961 13L0.849609 7.30001L2.27461 5.87501L6.54961 10.15L15.7246 0.975006L17.1496 2.40001L6.54961 13Z"
            fill="#0078DB"
          />
        </Svg>
      )}
    />
  );
};
