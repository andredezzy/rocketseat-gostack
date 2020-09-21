import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { useNavigation } from '@react-navigation/native';

import { useAuthentication } from '../../hooks/authentication';
import api from '../../services/api';

import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
  ProvidersList,
  ProvidersListTitle,
  ProviderContainer,
  ProviderAvatar,
  ProviderInfo,
  ProviderName,
  ProviderMeta,
  ProviderMetaText,
} from './styles';

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuthentication();
  const { navigate } = useNavigation();

  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    api.get('providers').then(response => {
      setProviders(response.data);
    });
  }, []);

  const handleNavigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  const handleNavigateToCreateAppointment = useCallback(
    (providerId: string) => {
      navigate('CreateAppointment', { providerId });
    },
    [navigate],
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#28262e" />

      <Container>
        <Header>
          <HeaderTitle>
            Bem vindo, {'\n'}
            <UserName>{user.name}</UserName>
          </HeaderTitle>

          <ProfileButton onPress={handleNavigateToProfile}>
            <UserAvatar source={{ uri: user.avatar_url }} />
          </ProfileButton>
        </Header>

        <ProvidersList
          data={providers}
          keyExtractor={provider => provider.id}
          ListHeaderComponent={() => (
            <ProvidersListTitle>Cabeleireiros</ProvidersListTitle>
          )}
          renderItem={({ item: provider }) => (
            <ProviderContainer
              onPress={() => handleNavigateToCreateAppointment(provider.id)}
            >
              <ProviderAvatar source={{ uri: provider.avatar_url }} />

              <ProviderInfo>
                <ProviderName>{provider.name}</ProviderName>

                <ProviderMeta>
                  <Icon name="calendar" size={14} color="#ff9000" />
                  <ProviderMetaText>Segunda à sexta</ProviderMetaText>
                </ProviderMeta>

                <ProviderMeta>
                  <Icon name="clock" size={14} color="#ff9000" />
                  <ProviderMetaText>8h às 18h</ProviderMetaText>
                </ProviderMeta>
              </ProviderInfo>
            </ProviderContainer>
          )}
        />
      </Container>
    </>
  );
};

export default Dashboard;
