import React from 'react';
import {ReactNode} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native';
import {OpenEyeIcon} from './icons/open-eye';
import {typography} from './styles';

const styles = StyleSheet.create({
  errorMessageContainer: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    width: 72,
    justifyContent: 'space-between',
  },
});

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
      return (
        <SafeAreaView>
          <View style={styles.errorMessageContainer}>
            <Text style={typography.title}>Something went wrong.</Text>
            <View style={styles.row}>
              <View>
                <OpenEyeIcon />
                <OpenEyeIcon />
                <OpenEyeIcon />
              </View>
              <View>
                <OpenEyeIcon />
                <OpenEyeIcon />
                <OpenEyeIcon />
                <OpenEyeIcon />
              </View>
            </View>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}
