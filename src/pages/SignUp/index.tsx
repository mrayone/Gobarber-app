import React, { useEffect, useRef, useCallback } from 'react';

import {
  Image,
  KeyboardAvoidingView,
  Platform,
  View,
  Keyboard,
  TextInput,
} from 'react-native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Container, Title, BackToSignIn, BackToSignInText } from './styles';
import logoImg from '../../assets/logo.png';

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

  const handleSubmit = useCallback(() => {
    formRef.current?.submitForm();
  }, []);

  const handleSignUp = useCallback((data: object) => {
    console.log(data);
  }, []);

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
