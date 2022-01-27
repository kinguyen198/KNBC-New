
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
//import { firebase } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import {
  appleAuth,
  AppleButton,
} from "@invertase/react-native-apple-authentication";
const ButtonLogin = (props) => (
  <TouchableOpacity
    style={[styles.button, { backgroundColor: props.color }]}
    onPress={props.onPress}
  >
    <Image style={styles.imageButton} source={props.image} />
    <Text style={[styles.textButton, { color: props.colorText }]}>
      {props.text}
    </Text>
  </TouchableOpacity>
);

const App = () => {
  GoogleSignin.configure({
    webClientId:
      '581485958090-ladigq74dh48s7v8s2btlrn0s8gj5rml.apps.googleusercontent.com',
  });
  const onGoogleButtonPress = async () => {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  };
  const loginWithGoogle = () => {
    console.log("loginWithGoogle")
    onGoogleButtonPress().then(async user => {
      console.log('Login Success with google')
      console.log(user.user.email)
      console.log(user.user.displayName)
      console.log(user.user.photoURL)
    });
  }
  const onFacebookButtonPress = async () => {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      "public_profile",
      "email",
    ]);

    if (result.isCancelled) {
      throw "User cancelled the login process";
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw "Something went wrong obtaining access token";
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken
    );

    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  };
  const loginWithFacebook = () => {
    console.log("loginWithFacebook")
    onFacebookButtonPress().then(async (user) => {
      console.log("Login Success with facebook");
      console.log(user.user);
    })

  }
  const onAppleButtonPress = async () => {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw "Apple Sign-In failed - no identify token returned";
    }

    // Create a Firebase credential from the response
    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce
    );

    // Sign the user in with the credential
    return auth().signInWithCredential(appleCredential);
  };
  const loginWithApple = async () => {
    onAppleButtonPress().then(async (user) => {
      console.log("Login Success with apple")
      console.log(user.user.providerData)
      console.log(user.additionalUserInfo)
    })
  }
  return (
    <SafeAreaView style={styles.container}>
      <ButtonLogin
        text={"Tiếp tục với Google"}
        image={require("./assets/google.png")}
        color={"#rgb(23,156,82)"}
        colorText="white"
        onPress={loginWithGoogle}
      />
      <ButtonLogin
        text={"Tiếp tục với Facebook"}
        image={require("./assets/facebook.png")}
        color={"#rgb(59, 89, 152)"}
        colorText="white"
        onPress={loginWithFacebook}
      />
      {Platform.OS === "ios" ? (
        <AppleButton
          buttonStyle={AppleButton.Style.WHITE}
          buttonType={AppleButton.Type.CONTINUE}
          style={styles.button}
          onPress={loginWithApple}
          cornerRadius={10}
        />
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '80%',
    height: 50,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  imageButton: {
    width: 30,
    aspectRatio: 1,
    marginRight: 7,
    resizeMode: "contain",
  },
  textButton: {
    fontSize: 16,
    fontWeight: '500'
  },
});

export default App;
