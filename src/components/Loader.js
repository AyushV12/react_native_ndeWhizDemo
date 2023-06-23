import React from "react";
import { StyleSheet, View,Image,Text } from "react-native";
import colors from "../constants/colors";
import { ActivityIndicator} from 'react-native-paper';


const Loader = (props) => {
  return (
    <View style={{flex:1,justifyContent:'center',backgroundColor:'#000'}}>
        {/* <Image source={require('../assets/images/data_transfer.gif')} style={{height:300,width:300,alignSelf:'center'}} /> */}
        <ActivityIndicator size={50} animating={true} color={colors.white} />
        <Text style={{textAlign:'center',color:colors.white,marginTop:25,fontSize:15}}>{props.title}</Text>
      </View>
  );
};


export default Loader;
