import React, { useEffect, useRef, useCallback } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  View,
  Keyboard,
  TextInput,
  Alert,
} from 'react-native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import * as Yup from 'yup';
import ImagePicker from 'react-native-image-picker';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {
  Container,
  Title,
  UserAvatarButton,
  UserAvatar,
  BackButton,
} from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
  old_password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const backToSignInRef = useRef<View>(null);
  const senhaInputRef = useRef<TextInput>(null);
  const senhaAntigaInputRef = useRef<TextInput>(null);
  const confirmacaoInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();

  const formRef = useRef<FormHandles>(null);
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', keyBoardDidShowHandler);
    Keyboard.addListener('keyboardDidHide', keyBoardDidHideHandler);

    return () => {
      Keyboard.removeListener('keyboardDidShow', keyBoardDidShowHandler);
      Keyboard.removeListener('keyboardDidHide', keyBoardDidHideHandler);
    };
  }, []);

  const handleSubmit = useCallback(async () => {
    await formRef.current?.submitForm();
  }, []);

  const handleProfile = useCallback(
    async (data: ProfileFormData) => {
      formRef.current?.setErrors({});
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (val) => !!val.length,
            then: Yup.string()
              .required('Campo obrigátorio')
              .min(6, 'No mínimo 6 digitos'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: (val) => !!val.length,
              then: Yup.string().required('Campo obrigátorio'),
              otherwise: Yup.string(),
            })
            .oneOf(
              [Yup.ref('password'), null || undefined],
              'Confirmação incorreta.',
            ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          password,
          old_password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);

        await updateUser(response.data);
        Alert.alert('Perfil atualizado com sucesso!');
        navigation.navigate('Dashboard');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(error));
          return;
        }

        Alert.alert(
          'Erro na atualização do perfil',
          'Ocorreu um erro ao atualizar o seu perfil',
        );
      }
    },
    [navigation, updateUser],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const keyBoardDidShowHandler = (): void => {
    backToSignInRef.current?.setNativeProps({
      display: 'none',
    });
  };

  const keyBoardDidHideHandler = (): void => {
    backToSignInRef.current?.setNativeProps({
      display: 'flex',
    });
  };

  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Selecione um avatar',
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'Usar câmera',
        chooseFromLibraryButtonTitle: 'Escolher da galeria',
      },
      (response) => {
        if (response.didCancel) {
          return;
        }
        if (response.error) {
          Alert.alert('Erro ao atualizar o seu avatar');
          return;
        }

        const data = new FormData();
        data.append('avatar', {
          uri: response.uri,
          type: 'image/jpg',
          name: `${user.id}.jpg`,
        });

        api
          .patch('users/avatar', data)
          .then((resp) => {
            updateUser(resp.data);
          })
          .catch((error) => {
            console.log(error);
          });
      },
    );
  }, [user.id, updateUser]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Container horizontal={false}>
        <BackButton onPress={handleGoBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <UserAvatarButton onPress={handleUpdateAvatar}>
          <UserAvatar source={{ uri: user.avatar_url }} />
        </UserAvatarButton>
        <View>
          <Title>Meu perfil</Title>
        </View>

        <Form initialData={user} onSubmit={handleProfile} ref={formRef}>
          <Input
            autoCapitalize="words"
            name="name"
            icon="user"
            placeholder="Nome"
            returnKeyType="next"
            onSubmitEditing={() => {
              emailInputRef.current?.focus();
            }}
          />
          <Input
            name="email"
            ref={emailInputRef}
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            icon="mail"
            placeholder="E-mail"
            returnKeyType="next"
            onSubmitEditing={() => {
              senhaAntigaInputRef.current?.focus();
            }}
          />
          <Input
            secureTextEntry
            ref={senhaAntigaInputRef}
            textContentType="newPassword"
            name="old_password"
            icon="lock"
            placeholder="Senha atual"
            containerStyle={{ marginTop: 16 }}
            returnKeyType="next"
            onSubmitEditing={() => {
              senhaInputRef.current?.focus();
            }}
          />

          <Input
            secureTextEntry
            ref={senhaInputRef}
            textContentType="newPassword"
            name="password"
            icon="lock"
            placeholder="Nova Senha"
            returnKeyType="next"
            onSubmitEditing={() => {
              confirmacaoInputRef.current?.focus();
            }}
          />

          <Input
            secureTextEntry
            ref={confirmacaoInputRef}
            textContentType="newPassword"
            name="password_confirmation"
            icon="lock"
            placeholder="Confirmação de senha"
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
          />
          <Button onPress={handleSubmit}>Confirmar Mudanças</Button>
        </Form>
      </Container>
    </KeyboardAvoidingView>
  );
};

export default Profile;
