import React,{useState,useEffect} from 'react'
import { SafeAreaView, View,  TouchableOpacity , Image , StatusBar , Alert , Linking } from 'react-native';
import colors from '../constants/colors';
import { DefaultTheme, Appbar, Snackbar , Text ,ActivityIndicator ,Divider , Avatar } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DeviceInfo from 'react-native-device-info';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';




const OnboardingScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loaderText, setLoaderText] = useState("Please wait while we getting data from server");
  const [openNavigationPage, setOpenNavigationPage] = useState("Login");
  const [visibleSnackBar, setVisibleSnackBar] = useState(false);
  const [snackBarText, setSnackBarText] = useState("");
  

  const onShowSnackBar = () => setVisibleSnackBar(true);
  const onDismissSnackBar = () => setVisibleSnackBar(false);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@email')
      if(value !== null) {
        // value previously stored
        navigation.replace("Dashboard");
      }
      else{
        setOpenNavigationPage("Login");
      }
    } catch(e) {
      // error reading value
    }
  }

  useEffect(() => {
    let manufacturer=""
    //setIsLoading(true);
    //setLoaderText("Validating device");
    DeviceInfo.getManufacturer().then((manufacturer) => {
      manufacturer=manufacturer;
    });
    let imei=""
    DeviceInfo.getUniqueId().then((uniqueId) => {
      imei=uniqueId;
    });
    let url="";
    setIsLoading(false);
    getData();
    
  },[]);


  if(isLoading)
  {
    return <Loader title={loaderText}/>
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}>
        <StatusBar backgroundColor={colors.primary} />
      <View style={{marginTop: 20}}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 30,
            color: '#20315f',
          }}>
          NDT WHIZ
        </Text>
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={require('../assets/images/logo.png')}
          style={{height: 150, width: 300, borderRadius: 10}}
        />
      </View>
      
      <TouchableOpacity
        style={{
          backgroundColor: '#AD40AF',
          padding: 20,
          width: '90%',
          borderRadius: 10,
          marginBottom: 50,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
        onPress={() => navigation.replace(openNavigationPage)}>
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          Let's Begin
        </Text>
        <MaterialIcons name="arrow-forward-ios" size={22} color="#fff" />
      </TouchableOpacity>
      
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
    </SafeAreaView>
  );
};

export default OnboardingScreen;
