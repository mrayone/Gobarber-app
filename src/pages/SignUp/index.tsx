import React, { useEffect, useRef, useCallback } from 'react';

import {
  Image,
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
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Container, Title, BackToSignIn, BackToSignInText } from './styles';
import logoImg from '../../assets/logo.png';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const backToSignInRef = useRef<View>(null);
  const senhaInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();

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

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      formRef.current?.setErrors({});
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().required().min(6, 'No mínimo 6 digitos'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        Alert.alert(
          'Cadastro realizado com sucesso!',
          'Você já pode fazer login na aplicação',
        );

        navigation.goBack();

        // history.push('/');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(error));
          return;
        }

        console.log(error);

        Alert.alert(
          'Erro no cadastro',
          'Ocorreu um erro ao fazer o cadastro, tente novamente',
        );
      }
    },
    [navigation],
  );

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

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <Container>
          <Image source={logoImg} />
          <View>
            <Title>Criar sua conta</Title>
          </View>

          <Form onSubmit={handleSignUp} ref={formRef}>
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
                senhaInputRef.current?.focus();
              }}
            />
            <Input
              secureTextEntry
              ref={senhaInputRef}
              textContentType="newPassword"
              name="password"
              icon="lock"
              placeholder="Senha"
              returnKeyType="send"
              onSubmitEditing={handleSubmit}
            />

            <Button onPress={handleSubmit}>Entrar</Button>
          </Form>
        </Container>
      </KeyboardAvoidingView>

      <View ref={backToSignInRef}>
        <BackToSignIn onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#f4ede8" />
          <BackToSignInText>Criar uma conta</BackToSignInText>
        </BackToSignIn>
      </View>
    </>
  );
};

export default SignUp;
