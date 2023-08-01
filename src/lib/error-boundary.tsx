import React from 'react';
import {ReactNode} from 'react';
import {Text} from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(_: Error) {
    return {hasError: true};
  }

  componentDidCatch() {}

  render() {
    if (this.state.hasError) {
      return <Text>Something went wrong.</Text>;
    }

    return this.props.children;
  }
}
