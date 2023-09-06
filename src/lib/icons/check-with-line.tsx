import React from 'react';
import Svg, {Line, Path} from 'react-native-svg';

interface Props {
  color: string;
}

export function CheckIcon({color = '#000'}: Props) {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M4 20L20 20" stroke={color} strokeWidth="2" />
      <Line
        x1="4.6388"
        y1="11.2306"
        x2="10.1013"
        y2="15.7661"
        stroke={color}
        strokeWidth="2"
      />
      <Line
        x1="20.0197"
        y1="2.62282"
        x2="9.14751"
        y2="16.2803"
        stroke={color}
        strokeWidth="2"
      />
    </Svg>
  );
}
