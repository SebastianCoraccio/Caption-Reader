import React from 'react';
import Svg, {Line, Path} from 'react-native-svg';

interface Props {
  color: string;
}

export function DownloadIcon({color = '#000'}: Props) {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M11.2929 16.7071C11.6834 17.0976 12.3166 17.0976 12.7071 16.7071L19.0711 10.3431C19.4616 9.95262 19.4616 9.31946 19.0711 8.92893C18.6805 8.53841 18.0474 8.53841 17.6569 8.92893L12 14.5858L6.34315 8.92893C5.95262 8.53841 5.31946 8.53841 4.92893 8.92893C4.53841 9.31946 4.53841 9.95262 4.92893 10.3431L11.2929 16.7071ZM11 2V16H13V2H11Z"
        fill={color}
      />
      <Path d="M4 20L20 20" stroke={color} strokeWidth="2" />
    </Svg>
  );
}
