import React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

interface Props {
  color: string;
}

export function OpenEyeIcon({color = '#000'}: Props) {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Circle cx="12.05" cy="12.05" r="6.25" stroke={color} strokeWidth="1.4" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 15.7C14.0434 15.7 15.7 14.0658 15.7 12.05C15.7 11.6288 15.6277 11.2243 15.4946 10.8479C15.2134 11.356 14.6719 11.7 14.05 11.7C13.1387 11.7 12.4 10.9613 12.4 10.05C12.4 9.43213 12.7396 8.89359 13.2423 8.61084C12.854 8.47433 12.4358 8.39999 12 8.39999C9.95653 8.39999 8.29999 10.0342 8.29999 12.05C8.29999 14.0658 9.95653 15.7 12 15.7Z"
        fill={color}
      />
      <Path
        d="M1.10001 12C7.85331 21.6867 17.3079 20.1468 23 12"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <Path
        d="M23 12C16.2467 2.74699 6.79207 4.21798 1.1 12"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </Svg>
  );
}
