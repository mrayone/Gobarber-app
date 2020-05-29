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
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../hooks/auth';
import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';
import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText,
} from './styles';
import logoImg from '../../assets/logo.png';

const SignIn: React.FC = () => {
  const createAccountButtonRef = useRef<View>(null);
  const navidation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const passwordInpuRef = useRef<TextInput>(null);
  const { signIn } = useAuth();

  interface SignInFormData {
    email: string;
    password: string;
  }

  const handleSign = useCallback(
    async (data: SignInFormData) => {
      formRef.current?.setErrors({});
      try {
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { email, password } = data;
        await signIn({ email, password });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(error));
          return;
        }

        Alert.alert(
          'Erro na autenticação',
          'Ocorreu um erro ao fazer login, cheque as credenciais.',
        );
      }
    },
    [signIn],
  );

  const handleSubmit = useCallback(async () => {
    await formRef.current?.submitForm();
  }, []);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', keyBoardDidShowHandler);
    Keyboard.addListener('keyboardDidHide', keyBoardDidHideHandler);

    return () => {
      Keyboard.removeListener('keyboardDidShow', keyBoardDidShowHandler);
      Keyboard.removeListener('keyboardDidHide', keyBoardDidHideHandler);
    };
  }, []);

  const keyBoardDidShowHandler = (): void => {
    createAccountButtonRef.current?.setNativeProps({
      display: 'none',
    });
  };

  const keyBoardDidHideHandler = (): void => {
    createAccountButtonRef.current?.setNativeProps({
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
            <Title>Faça seu logon</Title>
          </View>
          <Form onSubmit={handleSign} ref={formRef}>
            <Input
              name="email"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              icon="mail"
              placeholder="E-mail"
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordInpuRef.current?.focus();
              }}
            />
            <Input
              secureTextEntry
              name="password"
              icon="lock"
              ref={passwordInpuRef}
              placeholder="Senha"
              returnKeyType="send"
              onSubmitEditing={handleSubmit}
            />

            <Button onPress={handleSubmit}>Entrar</Button>
          </Form>

          <ForgotPassword onPress={() => {}}>
            <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
          </ForgotPassword>
        </Container>
      </KeyboardAvoidingView>

      <View ref={createAccountButtonRef}>
        <CreateAccountButton onPress={() => navidation.navigate('SignUp')}>
          <Icon name="log-in" size={20} color="#ff9000" />
          <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
        </CreateAccountButton>
      </View>
    </>
  );
};

export default SignIn;
