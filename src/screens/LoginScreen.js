import React, { useEffect , useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import axios from 'axios';
import { TextInput , DefaultTheme, Button, Card, Snackbar } from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';
import Loader from '../components/Loader';
import colors from '../constants/colors';
import string from '../constants/string';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({navigation}) => {  
  const [isLoading, setIsLoading] = useState(false);
  const [loaderText, setLoaderText] = useState("Please wait while we getting data from server");
  const [imei,setImei] = useState("");
  const [userName,setUserName] = useState("");
  const [password,setPassword] = useState("");
  const [snackBarText, setSnackBarText] = useState("");
  const [visibleSnackBar, setVisibleSnackBar] = useState(false);
  
  
  const onShowSnackBar = () => setVisibleSnackBar(true);
  const onDismissSnackBar = () => setVisibleSnackBar(false);

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      secondary: colors.accent,
    },
  };


  useEffect(() => {
    DeviceInfo.getUniqueId().then((uniqueId) => {
      setImei(uniqueId);
    });
  },[]);


  const userNameChangeHandler = (value) => {
    setUserName(value);
  }

  const passwordChangeHandler = (value) => {
    setPassword(value);
  }

  const loginAction = async () => {
    //navigation.replace('Dashboard')
    
    if(userName.length==0)
    {
      setSnackBarText("Please enter username")
      setVisibleSnackBar(true);
    }
    else if(password.length==0)
    {
      setSnackBarText("Please enter password")
      setVisibleSnackBar(true);
    }
    else{
      //navigation.replace("Dashboard");
      try {
        let response = await axios.post(string.url+'/rpc.AuthService/Login', { name: userName, password: password });
        console.log(response,"afterLogin");
        await AsyncStorage.setItem('@email', userName);
        await AsyncStorage.setItem('@password', password);
        navigation.replace("Dashboard");
        //let data=response.data;
        //await session.authenticate('user', user);
        //navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      } catch (e) {
        setSnackBarText("Ooops!! email or password incorrect please enter correct details");
        setVisibleSnackBar(true);
        //console.log('error: ', e);
      }
    }
    
  };

  if(isLoading)
  {
    return <Loader title={loaderText}/>
  }

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <StatusBar backgroundColor={colors.primary} />
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
      >
        <View style={{flex:1,justifyContent: 'space-between'}}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View style={{paddingHorizontal: 25}}>
              <Card mode='elevated' elevation={5} theme={theme}>
                <Card.Content>
                  <View style={{alignItems: 'center'}}>
                    <Image
                      source={require('../assets/images/logo.png')}
                      style={{height: 150, width: 150, borderRadius: 10}}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: '500',
                      color: '#333',
                      textAlign:'center',
                      marginBottom: 30,
                    }}>
                    Login
                  </Text>
                  
                  <TextInput
                    mode="outlined"
                    label="Username"
                    placeholder="Enter username"
                    value={userName}
                    keyboardType='email-address'
                    onChangeText={userNameChangeHandler}
                  />

                  <TextInput
                    mode="outlined"
                    label="Password"
                    secureTextEntry
                    placeholder="Enter password"
                    value={password}
                    onChangeText={passwordChangeHandler}
                  />  
                  <View style={{flexDirection:'row',alignSelf:'center',marginTop:20}}>
                    <View style={{width:'50%',margin:5}}>
                      <Button icon="login" mode="contained" onPress={() =>loginAction()}>
                        Login
                      </Button>
                    </View>
                    <View style={{width:'50%',margin:5}}>
                      <Button icon="information" mode="contained" onPress={() =>navigation.replace("Register")}>
                        Register
                      </Button>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            </View>
          </View>
          <Snackbar
            visible={visibleSnackBar}
            onDismiss={onDismissSnackBar}
            action={{
              label: 'Dismiss',
              onPress: () => {
                onDismissSnackBar()
              },
            }}>
            {snackBarText}
          </Snackbar>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default LoginScreen;
