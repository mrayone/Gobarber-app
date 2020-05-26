import React, { useEffect, useRef } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
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
  const createAccountButtonRef = useRef() as React.MutableRefObject<View>;

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', keyBoardDidShowHandler);
    Keyboard.addListener('keyboardDidHide', keyBoardDidHideHandler);

    return () => {
      Keyboard.removeListener('keyboardDidShow', keyBoardDidShowHandler);
      Keyboard.removeListener('keyboardDidHide', keyBoardDidHideHandler);
    };
  }, []);

  const keyBoardDidShowHandler = (): void => {
    createAccountButtonRef.current.setNativeProps({
      display: 'none',
    });
  };

  const keyBoardDidHideHandler = (): void => {
    createAccountButtonRef.current.setNativeProps({
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

          <Input name="email" icon="mail" placeholder="E-mail" />
          <Input name="password" icon="lock" placeholder="Senha" />

          <Button
            onPress={() => {
              console.log('Deu!!');
            }}
          >
            Entrar
          </Button>

          <ForgotPassword onPress={() => {}}>
            <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
          </ForgotPassword>
        </Container>
      </KeyboardAvoidingView>

      <View ref={createAccountButtonRef}>
        <CreateAccountButton>
          <Icon name="log-in" size={20} color="#ff9000" />
          <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
        </CreateAccountButton>
      </View>
    </>
  );
};

export default SignIn;
