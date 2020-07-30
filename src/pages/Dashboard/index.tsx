import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';

import {
  Container,
  Header,
  HeaderText,
  UserName,
  ProfileButton,
  UserAvatar,
} from './styles';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  return (
    <Container>
      <Header>
        <HeaderText>
          Bem Vindo, {'\n'}
          <UserName>{user.name}</UserName>
        </HeaderText>
        <ProfileButton onPress={navigateToProfile}>
          <UserAvatar source={{ uri: user.avatar_url }} />
        </ProfileButton>
      </Header>
    </Container>
  );
};

export default Dashboard;
