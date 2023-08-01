import {useNavigation} from '@react-navigation/core';
import {StackParamList} from '../../navigation';
import {useIsTablet} from './use-is-tablet';

export function useLayoutAwareNavigation() {
  const navigation = useNavigation();
  const isTablet = useIsTablet();

  function navigateToPlayer(options: StackParamList['Player']) {
    if (isTablet) {
      return navigation.setParams(options);
    }
    return navigation.navigate('Player', options);
  }

  function navigateToFolder({folder}: StackParamList['VideoList']) {
    if (isTablet) {
      return navigation.setParams({folder, title: undefined});
    }
    return navigation.navigate('VideoList', {folder});
  }

  return {navigateToPlayer, navigateToFolder};
}
