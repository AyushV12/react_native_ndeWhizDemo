import React, { useEffect , useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  ToastAndroid,
  Alert

} from 'react-native';
import axios from 'axios';
import { TextInput , DefaultTheme, Button, Card, Snackbar } from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';
import Loader from '../components/Loader';
import colors from '../constants/colors';
import string from '../constants/string';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { ToastAndroid } from 'react-native';

const RegisterScreen = ({navigation}) => {  
  const [isLoading, setIsLoading] = useState(false);
  const [loaderText, setLoaderText] = useState("Please wait while we getting data from server");
  const [imei,setImei] = useState("");
  const [userName,setUserName] = useState("");
  const [fullName,setFullName] = useState("");
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
  
      const attrdb = "0";
      const attrSel = [];
      const attrOpt = [];
      attrSel.push({ S1: "", S2: "", S3: "", S4: "", S5: "", S6: "", S7: "", S8: "" });
      attrOpt.push({ P1: "Disable", P2: "Disable", P3: "Disable", P4: "", P5: "Empty", P6: "", P7: "", P8: "" });
      const dataJsON = JSON.stringify({ db: attrdb, sel: attrSel, opt: attrOpt });
      console.log(JSON.stringify({ name: userName, password: password, data: dataJsON }));
      // let response1 = await axios.post(string.url+'.AddUser', { name: userName, password: password, data: dataJsON });

      try {


        let responseLoginCheck = await axios.post(string.url + '/rpc.AuthService/Login', { name: userName, password: password });
        console.log(responseLoginCheck, "responseLoginCheckBeforeRegister")
        console.log(responseLoginCheck.status)
        ToastAndroid.show("Error! User Account already exists with above specified Username and Password", ToastAndroid.SHORT)
      }

      catch (error) {
        try {
          let response = await axios.post("https://nw01.cognivea.com/user/rpc.AuthService/AddUser", { name: userName, password: password, data: dataJsON })
          console.log("--------------After Register SUccessful", response)
          // setVisibleSnackBar(true);
          ToastAndroid.showWithGravity('Sign up Successful!,Login when your account is approved', ToastAndroid.SHORT, ToastAndroid.TOP);
          navigation.replace("Login");
        }
        catch (error) {
          console.log("errorAfterRegistering", error)
          ToastAndroid.showWithGravity(' Authorization Error!', ToastAndroid.SHORT, ToastAndroid.TOP);
          
        }
      }
        
        //let data=response.data;
        //await session.authenticate('user', user);
        //navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    
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
                    Register
                  </Text>
                  
                  <TextInput
                    mode="outlined"
                    label="Full Name"
                    placeholder="Enter fullname"
                    value={fullName}
                    keyboardType='email-address'
                    onChangeText={(value)=>setFullName(value)}
                  />

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
                      <Button icon="information" mode="contained" onPress={() =>loginAction()}>
                        Register
                      </Button>
                    </View>
                    <View style={{width:'50%',margin:5}}>
                      <Button icon="login" mode="contained" onPress={() =>navigation.replace("Login")}>
                        Login
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

export default RegisterScreen;
