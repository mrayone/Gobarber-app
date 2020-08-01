import styled from 'styled-components/native';
import { getStatusBarHeight, isIphoneX } from 'react-native-iphone-x-helper';
import { FlatList } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Provider } from './index';

interface ProviderContainerProps {
  selected: boolean;
}

interface ProviderNameProps {
  selected: boolean;
}

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  padding: 24px;
  background: #28262e;
  ${isIphoneX() ? `padding-top: ${getStatusBarHeight() + 24}px;` : ''}
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderTitle = styled.Text`
  color: #f5ede8;
  font-family: 'RobotoSlab-Mediu';
  font-size: 20px;
  margin-left: 16px;
`;

export const BackButton = styled.TouchableOpacity``;

export const UserAvatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  margin-left: auto;
`;

export const ProvidersList = styled(FlatList as new () => FlatList<Provider>)`
  padding: 32px 24px;
`;

export const ProvidersListContainer = styled.View`
  height: 112px;
`;

export const ProviderContainer = styled(RectButton)<ProviderContainerProps>`
  flex-direction: row;
  align-items: center;
  background: ${(props) => (props.selected ? '#ff9000' : '#3E3B47')};
  border-radius: 10px;
  margin-right: 16px;
  padding: 10px;
`;
export const ProviderAvatar = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 17px;
`;
export const ProviderName = styled.Text<ProviderNameProps>`
  font-family: 'RobotoSlab-Medium';
  color: ${(props) => (props.selected ? '#232129' : '#f4ede8')};
  margin-left: 8px;
  font-size: 16px;
  line-height: 18px;
`;
