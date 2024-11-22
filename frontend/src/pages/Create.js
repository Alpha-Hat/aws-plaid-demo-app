import { Authenticator } from '@aws-amplify/ui-react';
import { useAuthenticator, View } from '@aws-amplify/ui-react';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';

export default function CreateAccount() {
  const { route } = useAuthenticator((context) => [context.route]);
  const location = useLocation();
  const navigate = useNavigate();
  let from = location.state?.from?.pathname || '/';

  // Define custom components for the SignUp flow
  const components = {
    SignUp: {
      Header() {
        return (
          <View textAlign="center" padding="xs">
            <h3>Create Your Account</h3>
            <p>Sign up to access all features</p>
          </View>
        );
      },
      Footer() {
        return (
          <View textAlign="center">
            <strong>Password Policy</strong>:
            <ul>
              <li>Minimum of 8 characters</li>
              <li>At least one lowercase character</li>
              <li>At least one uppercase character</li>
              <li>At least one number character</li>
              <li>At least one symbol character</li>
            </ul>
          </View>
        );
      },
    },
  };

  // Automatically redirect authenticated users
  useEffect(() => {
    if (route === 'authenticated') {
      navigate(from, { replace: true });
    }
  }, [route, navigate, from]);

  return (
    <View className="auth-wrapper">
      <Authenticator
        signUpAttributes={['email', 'username']}
        formFields={{
          signUp: {
            username: {
              placeholder: 'Enter your username',
              isRequired: true,
            },
            password: {
              placeholder: 'Enter your password',
              isRequired: true,
            },
            email: {
              placeholder: 'Enter your email',
              isRequired: true,
            },
          },
        }}
        components={components}
      />
    </View>
  );
}
