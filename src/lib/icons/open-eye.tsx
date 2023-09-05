import React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

interface Props {
  color?: string;
}

export function OpenEyeIcon({color = '#000'}: Props) {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="4" fill={color} />
      <Path
        d="M1.10001 12C7.85331 21.6867 17.3079 20.1468 23 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M23 12C16.2467 2.747 6.79207 4.218 1.1 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}
