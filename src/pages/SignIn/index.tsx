import React, { useEffect, useRef, useCallback } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  View,
  Keyboard,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import Icon from 'react-native-vector-icons/Feather';
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

  const handleSign = useCallback((data: object) => {
    console.log(data);
  }, []);

  const handleSubmit = useCallback(() => {
    formRef.current?.submitForm();
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
