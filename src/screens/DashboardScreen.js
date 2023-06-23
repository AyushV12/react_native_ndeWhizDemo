import React, { useEffect , useState } from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  StyleSheet,
  ScrollView,
  FlatList,
  Linking,
  Platform,
  Alert,
  PermissionsAndroid,
  Image,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import RNFetchBlob from "rn-fetch-blob";
import FileViewer from "react-native-file-viewer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { DefaultTheme,IconButton, Appbar, Snackbar , Text ,RadioButton ,Divider , Button , Card ,Chip ,Portal, Dialog ,Switch,ProgressBar, DataTable, TextInput } from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';
import Loader from '../components/Loader';
import colors from '../constants/colors';
import string from '../constants/string';
//import {request,check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import { HideUnhidePassword } from '../components/hideUnhide';
import Icon from 'react-native-vector-icons/FontAwesome';
// import Spinner from 'react-native-loading-spinner-overlay';
const DashboardScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loaderText, setLoaderText] = useState("Please wait while we getting data from server");
  const [imei,setImei] = useState("");
  const [name,setName] = useState(""); 
  const [component,setComponent] = useState([]);
  const [subComponent,setSubComponent] = useState([]);
  const [subComponentData,setSubComponentData] = useState([]);
  const [snackBarText, setSnackBarText] = useState("");
  const [visibleSnackBar, setVisibleSnackBar] = useState(false);
  const [workflowRadioButton, setWorkflowRadioButton] = useState("Workflow");
  const [noForkflowSequence, setNoForkflowSequence] = useState(false);
  const [ndeInformationSubItem, setNdeInformationSubItem] = useState([]);
  const [locInformationSubItem, setLocInformationSubItem] = useState([]);
  const [visibleChangeOptionConfirmation,setVisibleChangeOptionConfirmation] = useState(false);
  const [manualData,setManualData] = useState([]);
  const [spreadsheetData,setSpreadsheetData] = useState([]);
  const [flowchartData,setFlowchartData] = useState([]);
  const [dataitemData,setDataitemData] = useState([]);
  const [referenceData,setReferenceData] = useState([]);
  const [outerItemSheetId,setOuterItemSheetId] = useState("");
  const [outerItemSheetName,setOuterItemSheetName] = useState("");
  const [progressBar,setProgressBar] = useState(0.0);
  const [refrenceSheetId,setRefrenceSheetId] = useState("");
  const [refrenceData,setRefrenceData] = useState([]);
  const [refrenceSheetData,setRefrenceSheetData] = useState([]);
  const [trainingData,setTrainingData] = useState([]);
  const [trainingResultData,setTrainingResultData] = useState([]);
  const [filterSubItem,setFilterSubItem] = useState("");
  
  const [workflowName, setWorkflowName] = useState("");
  const [openWorkflowName, setOpenWorkflowName] = useState(false);
  const [itemsWorkflowName, setItemsWorkflowName] = useState([]);

  const [damageMechanism, setDamageMechanism] = useState("");
  const [openDamageMechanism, setOpenDamageMechanism] = useState(false);
  const [itemsDamageMechanism, setItemsDamageMechanism] = useState([]);

  const [inspect, setInspect] = useState("");
  const [openInspect, setOpenInspect] = useState(false);
  const [itemsInspect, setItemsInspect] = useState([]);
  var [showModalUserDetails,setShowModalUserDetails]=useState(false)
  var [showModalDeleteAccount,setShowModalDeleteAccount]=useState(false)
  var [showModalChangePassword,setShowModalChangePassword]=useState(false)

  var [tempValueUserName,setTempValueUserName]=useState("")
  var [passwordValue,setPasswordValue]=useState("")
  var [tempValuePassword,setTempValuePassword]=useState("")
  var [tempValue1,setTempValue1]=useState("")
  var [tempValue2,setTempValue2]=useState("")
  var [userId,setUserid]=useState("")
  var [activityIndicate,setActivityIndicate]=useState(false)
  const onShowSnackBar = () => setVisibleSnackBar(true);
  const onDismissSnackBar = () => setVisibleSnackBar(false);

  const [isRefrenceSwitch, setIsRefrenceSwitch] = useState(false);
  const onToggleSwitch = (sheetId) => {
    setRefrenceSheetId(sheetId);
    setIsRefrenceSwitch(!isRefrenceSwitch);
  };
  const [isTrainingSwitch, setIsTrainingSwitch] = useState("");
  const onToggleTrainingSwitch = (sheetId) => {
    //setIsTrainingSwitch(sheetId);
    setIsTrainingSwitch(sheetId);
  };

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      secondary: colors.accent,
    },
  };

  const getSessionData = async () => {
    try {
      setIsLoading(true);
      setLoaderText("Please wait while we getting data from server");
      const value = await AsyncStorage.getItem('@email')
      if(value !== null) {
        // value previously stored
        setName(value);
        const password=await AsyncStorage.getItem("@password")
        setPasswordValue(password)
        let responseMe = await axios.post(string.url+'/rpc.AuthService/Me', { });
        let respMe=responseMe.data;
        let userid=respMe.user.id
        setUserid(userid)
        const resp = await axios.get(string.url + `/api/blob/workspace/list/admin`);
        let appData=resp.data;

        let filterTemplate="";
        if (!respMe.isAdmin && respMe.user != null) 
        {
          if (respMe.user.id !== "" && respMe.user.data !== "") 
          {
           const obj = JSON.parse(respMe.user.data);
           if (obj.opt !== undefined) 
           {
            filterTemplate=obj.opt[0].P4;
            setFilterSubItem(obj.opt[0].P5);
           }
          }
        }


        setItemsWorkflowName([]);
        if(appData.length>0)
        {
          setItemsWorkflowName((itemsWorkflowName) => [
            ...itemsWorkflowName,
            {
              label: 'Select Worlflow Name',
              value: ''
            },
          ]);
          for(let i=0;i<appData.length;i++)
          {
            if(filterTemplate.length>3)
            {
              let filterTemplateArray=filterTemplate.split(",");
              for(let k=0;k<filterTemplateArray.length;k++)
              {
                if(appData[i]==filterTemplateArray[k])
                {
                  setItemsWorkflowName((itemsWorkflowName) => [
                    ...itemsWorkflowName,
                    {
                      label: appData[i],
                      value: appData[i]
                    },
                  ]);
                }
              }
            }
            else{
              setItemsWorkflowName((itemsWorkflowName) => [
                ...itemsWorkflowName,
                {
                  label: appData[i],
                  value: appData[i]
                },
              ]);
            }
            
          }
        }
        setIsLoading(false);
        //console.log(resp.data);
      }
      else{
        setOpenNavigationPage("Login");
      }
    } catch(e) {
      setIsLoading(false);
      console.log("Error : "+e);
      // error reading value
    }
  }

  useEffect(() => {
    DeviceInfo.getUniqueId().then((uniqueId) => {
      setImei(uniqueId);
    });
    getSessionData();
  },[]);

  const clearSessionData = async () => {
    try {
      await AsyncStorage.removeItem('@email');
      await AsyncStorage.removeItem('@password');
      navigation.replace("Onboarding");
    } catch(e) {
      console.log("Error : "+e);
      // error reading value
    }
  }

  const workflowNameChangeHandler = async (value) => {
    try{
      setIsRefrenceSwitch(false);
      setIsTrainingSwitch("");
      setTrainingData([]);
      setTrainingResultData([]);
      setRefrenceSheetData([]);
      setRefrenceSheetId("");
      setIsLoading(true);
      setLoaderText("Please wait while we getting data from server");
      setWorkflowName(value);
      let dataUrlFolder=string.url+ `/api/blob/folder/root/read/${"admin"}/${value}/${"master.json"}`;
      const responseFolder = await axios.get(dataUrlFolder);
      let dataUrl=string.url+ `/api/blob/workspace/read/${"admin"}/${value}/${"master.json"}`;
      const response = await axios.get(dataUrl);
      let appData=response.data;
      setRefrenceData(responseFolder.data[0].reference);
      setTrainingData(responseFolder.data[0].manual);
      console.log(dataUrlFolder,JSON.stringify(responseFolder.data));
      setIsLoading(false);
      setComponent(appData[0].component);
      setItemsDamageMechanism([]);





      setItemsDamageMechanism((itemsDamageMechanism) => [
        ...itemsDamageMechanism,
        {
          label: 'Select',
          value: ''
        },
      ]);
      if(appData[0].component.length>0)
      {
        for(let i=0;i<appData[0].component.length;i++)
        {
          if(filterSubItem.length>3)
          {
            let isDataRemoved=true;
            let filterSubItemArray=filterSubItem.split(",");
            //console.log('filterSubItemArray',filterSubItemArray);
            for(let k=0;k<filterSubItemArray.length;k++)
            {
              if(appData[0].component[i].name==filterSubItemArray[k])
              {
                isDataRemoved=false;
              }
            }
            if(isDataRemoved)
            {
              setItemsDamageMechanism((itemsDamageMechanism) => [
                ...itemsDamageMechanism,
                {
                  label: appData[0].component[i].name,
                  value: appData[0].component[i].name
                },
              ]);
            }
          }
          else{
            setItemsDamageMechanism((itemsDamageMechanism) => [
              ...itemsDamageMechanism,
              {
                label: appData[0].component[i].name,
                value: appData[0].component[i].name
              },
            ]);
          }
        }
      }
      getMasterData(value);
    }
    catch(e)
    {
      setIsLoading(false);
      console.log("Error : "+e);
    }
    
  };

  const damageMechanismChangeHandler = (value) => {
    try{
      setItemsInspect([]);
      setItemsInspect((itemsInspect) => [
        ...itemsInspect,
        {
          label: 'Select',
          value: ''
        },
      ]);
      for(var i=0;i<component.length;i++)
      {
        //console.log(component[0]);
        if(component[i].name==value)
        {
          let tempSubcomponent=component[i].subcomponent;
          //console.log('tempSubcomponent',tempSubcomponent)
          for(var j=0;j<tempSubcomponent.length;j++)
          {
            let name=tempSubcomponent[j].name;
            setItemsInspect((itemsInspect) => [
              ...itemsInspect,
              {
                label: name,
                value: name
              },
            ]);
            //console.log('tempSubcomponent - '+j,);
          }
        }
      }
    }
    catch(e)
    {
      console.log("Error : "+e);
    }
  };

  const inspectChangeHandler = (value) => {
    setInspect(value);
    setSubComponentData([]);
    setNdeInformationSubItem([]);
    setLocInformationSubItem([]);
    setNoForkflowSequence(false);
  };

  const resetData = () => {
    setSubComponentData([]);
    setNdeInformationSubItem([]);
    setLocInformationSubItem([]);
    setNoForkflowSequence(false);
  }

  const setData = async () => {
    try{
      if(workflowName.length==0)
      {
        setSnackBarText("Please select workflow");
        setVisibleSnackBar(true);
        return;
      }
      if(damageMechanism.length==0)
      {
        setSnackBarText("Please select damage mechanism");
        setVisibleSnackBar(true);
        return;
      }
      if(inspect.length==0)
      {
        setSnackBarText("Please select inspect");
        setVisibleSnackBar(true);
        return;
      }
      setIsLoading(true);
      setLoaderText("Please wait while we getting data from server");
      let dataUrl=string.url + `/api/blob/workspace/read/${"admin"}/${workflowName}/${damageMechanism}/${damageMechanism+`-`+inspect + ".json"}`;
      //console.log(dataUrl);
      const respy = await axios.get(dataUrl);
      setIsLoading(false);
      let resData=respy.data;
      setSubComponent(resData);
      setSubComponentData([]);
      for(let i=0;i<resData.length;i++)
      {
        setSubComponentData((subComponentData) => [
          ...subComponentData,
          {
            id: resData[i].id,
            name: resData[i].name,
            value:'',
            subItem : resData[i].subItem,
            type : resData[i].type,
            link : resData[i].link,
            color:'#959527' //yellow
          },
        ]);
      }
      //console.log(subComponentData);
    }
    catch(e)
    {
      setIsLoading(false);
      console.log("Error : "+e);
    }
  };

  const setSubData = async (name,value,link,type) => {
    try{
      let tempSubcomponent=subComponentData;
      setSubComponentData([]);
      setNdeInformationSubItem([]);
      setLocInformationSubItem([]);
      setNoForkflowSequence(false);
      //console.log('value',value.type);
      if(link.length==0 & type.length==0)
      {
        if(value[0].subItem.length==0)
        {
          setNoForkflowSequence(true);
        }
        else{
          if(value[0].subItem[0].type.length==0)
          {
            setSubComponentData((subComponentData) => [
              ...subComponentData,
              {
                id: value[0].id,
                name: value[0].name,
                value:'',
                subItem : value[0].subItem,
                type : value[0].type,
                link : value[0].link,
                color:'#959527' //yellow
              },
            ]);
          }
          else{
            let ndeinfo=searchNdeLocFunction(subComponent,value[0].id);
            setLocNdeData(ndeinfo);
            
          }
        }
      }
      else{
        if(link.length==0)
        {
          //console.log('type found');
        }
        else{
          //console.log('link found',link);
          let dt=searchFunction(subComponent,link);
          //console.log('dt',dt);
          if(dt.length==0)
          {
            setNoForkflowSequence(true);
          }
          else{
            if(dt.type.length==0)
            {
              setSubComponentData((subComponentData) => [
                ...subComponentData,
                {
                  id: dt.id,
                  name: dt.name,
                  value:'',
                  subItem : dt.subItem,
                  type : dt.type,
                  link : dt.link,
                  color:'#959527' //yellow
                },
              ]);
            }
            else{
              let ndeinfo=searchNdeLocFunction(subComponent,link);
              setLocNdeData(ndeinfo);
            }
          }
        }
      }
      for(let i=0;i<tempSubcomponent.length;i++)
      {
        //console.log(tempSubcomponent[i]);
        if(tempSubcomponent[i].value.length==0)
        {
          setSubComponentData((subComponentData) => [
            ...subComponentData,
            {
              id: tempSubcomponent[i].id,
              name: tempSubcomponent[i].name,
              value:name,
              subItem : [],
              type : tempSubcomponent[i].type,
              link : tempSubcomponent[i].link,
              color:'#114B22' //green
            },
          ]);
        }
        else{
          setSubComponentData((subComponentDataItem) => [
            ...subComponentDataItem,
            {
              id: tempSubcomponent[i].id,
              name: tempSubcomponent[i].name,
              value:tempSubcomponent[i].value,
              subItem : [],
              type : tempSubcomponent[i].type,
              link : tempSubcomponent[i].link,
              color:'#114B22' //green
            },
          ]);
        }
      }
    }
    catch(e)
    {
      console.log("Error : "+e);
    }
  };

  const setLocNdeData = (ndeinfo) => {
    //console.log('manualData',manualData);
    for(let k=0;k<ndeinfo.length;k++)
    {
      if(ndeinfo[k].type=="NDE")
      {
        let getMasterDataId=searchMasterFunction(manualData,ndeinfo[k].name);
        //console.log('getMasterDataId',getMasterDataId);
        let ndeSubInfo=ndeinfo[k].subItem;
        setNdeInformationSubItem((ndeInformationSubItem) => [
          ...ndeInformationSubItem,
          {
            name: ndeinfo[k].name,
            subName: ndeSubInfo[0].name,
            sheetId:getMasterDataId.id,
          },
        ]);
      }
      else{
        let getFlowChartDataId=searchMasterFunction(flowchartData,damageMechanism);
        let getSpreadSheetDataId=searchMasterFunction(spreadsheetData,damageMechanism);
        //console.log('getMasterDataId',getMasterDataId);
        setOuterItemSheetId(getFlowChartDataId.id);
        setOuterItemSheetName(getFlowChartDataId.name);
        let locSubInfo=ndeinfo[k].subItem;
        setLocInformationSubItem((locInformationSubItem) => [
          ...locInformationSubItem,
          {
            name: ndeinfo[k].name,
            subName: locSubInfo[0].name,
            sheetId:getFlowChartDataId.id,
            sheetSpreadSheetId:getSpreadSheetDataId.id
          },
        ]);
      }
    }
  }

  const searchFunction = (data, searchText) => {
    let result;
    for(let i = 0; i < data.length; i++) {
      if(data[i].id.includes(searchText)) {
        return data[i];
      } else if(data[i].subItem !== undefined) {
        result = searchFunction(data[i].subItem, searchText);
        if(result) return result;
      }else if(data[i].item !== undefined) {
        result = searchFunction(data[i].item, searchText);
        if(result) return result;
      }
    }
    
    return null;
  };

  const searchNdeLocFunction = (data, searchText) => {
    let result;
    for(let i = 0; i < data.length; i++) {
      if(data[i].id.includes(searchText)) {
        return data;
      } else if(data[i].subItem !== undefined) {
        result = searchNdeLocFunction(data[i].subItem, searchText);
        if(result) return result;
      }else if(data[i].item !== undefined) {
        result = searchNdeLocFunction(data[i].item, searchText);
        if(result) return result;
      }
    }
    return null;
  };

  const searchMasterFunction = (data, searchText) => {
    let result;
    for(let i = 0; i < data.length; i++) {
      if(data[i].name.includes(searchText)) {
        return data[i];
      }
    }
    
    return null;
  };

  const changeOption = (nodeId) => {
    try{
      let setData=false;
      let dt=searchFunction(subComponent,nodeId);
      let tempSubcomponent=subComponentData;
      setSubComponentData([]);
      setNdeInformationSubItem([]);
      setLocInformationSubItem([]);
      setNoForkflowSequence(false);
      if(dt.length==0)
      {
        setNoForkflowSequence(true);
      }
      else{
        setSubComponentData((subComponentData) => [
          ...subComponentData,
          {
            id: dt.id,
            name: dt.name,
            value:'',
            subItem : dt.subItem,
            type : dt.type,
            link : dt.link,
            color:'#959527' //yellow
          },
        ]);
      }
      for(let i=0;i<tempSubcomponent.length;i++)
      {
        //console.log(tempSubcomponent[i]);
        if(setData==true)
        {
          if(tempSubcomponent[i].value.length==0)
          {
            setSubComponentData((subComponentData) => [
              ...subComponentData,
              {
                id: tempSubcomponent[i].id,
                name: tempSubcomponent[i].name,
                value:name,
                subItem : [],
                type : tempSubcomponent[i].type,
                link : tempSubcomponent[i].link,
                color:'#114B22' //green
              },
            ]);
          }
          else{
            setSubComponentData((subComponentDataItem) => [
              ...subComponentDataItem,
              {
                id: tempSubcomponent[i].id,
                name: tempSubcomponent[i].name,
                value:tempSubcomponent[i].value,
                subItem : [],
                type : tempSubcomponent[i].type,
                link : tempSubcomponent[i].link,
                color:'#114B22' //green
              },
            ]);
          }
        }
        if(tempSubcomponent[i].id==nodeId)
        {
          setData=true;
        }
      }
    }
    catch(e)
    {

    }
  };

  const changeOptionConfirmation  = (nodeId) => {
    Alert.alert(
      "Change Option Confirmation",
      "Are you sure you want to change option ? ",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => changeOption(nodeId) }
      ]
    );
  };

  const getMasterData = async (value) => {
    let url=string.url+ `/api/blob/folder/root/read/${"admin"}/${value}/${"master.json"}`;
    //console.log(url);
    const respMaster = await axios.get(url);
    setManualData(respMaster.data[0].manual);
    setSpreadsheetData(respMaster.data[0].spreadsheet);
    setFlowchartData(respMaster.data[0].flowchart);
    setDataitemData(respMaster.data[0].dataitem);
    setReferenceData(respMaster.data[0].reference);
  
  };

  const requestFileAccessPermission = async (locationName,sheetId) => {
    try {
      if(Platform.OS=="android")
      {
        const OsVer = Platform.constants['Release'];
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: string.app_name,
            message:
              "App needs access to download file",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        const granted1 = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: string.app_name,
            message:
              "App needs access to download file",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED
          && granted1 === PermissionsAndroid.RESULTS.GRANTED) {
          //console.log("You can use the camera");
          downloadSpreadSheet(locationName,sheetId);
        } else {
          setSnackBarText("Sorry do not have permission to download file..");
          setVisibleSnackBar(true);
        }
      }
      else{
        downloadSpreadSheet(locationName,sheetId);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const downloadSpreadSheet = async (locationName,sheetId) => {
    let currentSelect = "spreadsheet";//flowchart or spreadsheet or manual or reference
    const sheet = "sheet_" + sheetId;
    let tableUrl=string.url + `/api/blob/folder/sheetfile/read/${"admin"}/${workflowName}/${currentSelect}/${sheet}/${"table.json"}`;
    //console.log(tableUrl);
    const responseTable = await axios.get(tableUrl);
    let tableItem=responseTable.data.tableItem;
    let inspectArray=inspect.split("-");
    let tableIndex=0;
    for(let i=0;i<tableItem.length;i++)
    {
      let firstElement=tableItem[i].col[0].name;
      let secondElement=tableItem[i].col[1].name;
      let thirdElement=tableItem[i].col[2].name;
      let locationElement=tableItem[i].col[4].name;
      locationElement="Location["+locationElement+"]";
      //console.log('matching Id ' + locationElement+" -- "+locationName)
      if(firstElement===inspectArray[0])
      {
        if(secondElement===inspectArray[1])
        {
          if(thirdElement===inspectArray[2])
          {
            if(locationElement===locationName)
            {
              //console.log('matching Id ' + locationElement+" -- "+i)
              tableIndex=i;
            }
          }
        }
      }
    }
    //console.log('tableIndex',tableIndex);
    let rowno= responseTable.data.tableItem[tableIndex].id;
    let colno= responseTable.data.tableItem[tableIndex].col[5].id;
    let link= responseTable.data.tableItem[tableIndex].col[5].uploadLink;
    let uploadName= responseTable.data.tableItem[tableIndex].col[5].uploadName;
    if(link.length==0)
    {
      setSnackBarText("Sorry file not found or invalid url..");
      setVisibleSnackBar(true);
      return false;
    }
    const rowx = "row_" + rowno;
    const colx = "col_" + colno;
    //Note: first row is heading info of table
    //---- document downloading select table row and col
    let downloadUrl=string.url+ `/api/blob/folder/sheet/read/${"admin"}/${workflowName}/${currentSelect}/${sheet}/${rowx}/${colx}/${link}`;
    //console.log(downloadUrl);
    let randomNumber=Math.floor(Math.random() * 100) + 1;
    //const pathToWrite = `${RNFetchBlob.fs.dirs.DownloadDir}/${randomNumber+"_"+uploadName}`;

    const { dirs } = RNFetchBlob.fs;
    const dirToSave = Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir
    const pathToWrite = `${dirToSave}/${randomNumber+"_"+uploadName}`;
    //const responseDownload=await axios.get(downloadUrl, { responseType: "blob" }) 
    //console.log(pathToWrite);
    downloadUrl=downloadUrl.replace(" ","%20");;
    setVisibleChangeOptionConfirmation(true);
    setProgressBar(0.0);
    try{
      const configfb = {
        fileCache: true,
        //useDownloadManager: true,
        notification: true,
        //mediaScannable: true,
        //title: pdfInfo.pdf,
        //path: `${pathToWrite}`,
      }
      const configOptions = Platform.select({
          ios: {
              fileCache: configfb.fileCache,
              title: configfb.title,
              path: configfb.path,
          },
          android: configfb,
      });
      RNFetchBlob.config(configOptions)
      .fetch("GET", downloadUrl, {
        //some headers ..
      })
      .uploadProgress({ interval: 250 }, (written, total) => {
        //console.log("uploaded", written / total);
      })
      // listen to download progress event, every 10%
      .progress({ count: 1 }, (received, total) => {
        //console.log("progress", received / total);
        let pr=received / total;
        setProgressBar(pr);
      })
      .then((res) => {
        // the temp file path
        //console.log("The file saved to ", res.path());
        RNFetchBlob.fs.writeFile(pathToWrite, res.path(), 'uri')
        .then((res)=>{ 
          //console.log("The file saved to ", res);
          setVisibleChangeOptionConfirmation(false);
          Alert.alert(
            "Download",
            uploadName+" successfully downlaoded.\n\nDo you want to open this file ?",
            [
              {
                text: "Later",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "Open", onPress: () => openExcelFile(pathToWrite) }
            ]
          );
        })
        .catch((error) => {
          setVisibleChangeOptionConfirmation(false);
          console.log(error);
          setSnackBarText("Error 1 : Sorry you do not have permission to download this file please provide read write permission");
          setVisibleSnackBar(true);
        });
        
      })
      .catch((error) => {
        setVisibleChangeOptionConfirmation(false);
        console.log('url',downloadUrl);
        //console.log('error',error);
        setSnackBarText("Error 1 : Sorry you do not have permission to download this file please provide read write permission",error);
        setVisibleSnackBar(true);
      });
      
      //console.log('responseDownload',responseDownload);
    }
    catch(e)
    {
      setVisibleChangeOptionConfirmation(false);
      console.log('responseDownload',e);
      //setSnackBarText(e);
      //setVisibleSnackBar(true);
      setSnackBarText("Sorry you do not have permission to download this file please provide read write permission");
      setVisibleSnackBar(true);
    }
  }

  const openExcelFile=(pathToWrite) => {
    FileViewer.open(pathToWrite) // absolute-path-to-my-local-file.
      .then((res) => {
        console.log(res);
        // success
      })
      .catch((error) => {
        // error
        //console.log("3456"+error);
        setSnackBarText("No associated app found to open this file");
        setVisibleSnackBar(true);
      });
  };



  const requestFileAccessPermissionFlowChart = async (currentSelect,locationName,sheetId,colIndex) => {
    try {
      if(Platform.OS=="android")
      {
        const OsVer = Platform.constants['Release'];
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: string.app_name,
            message:
              "App needs access to download file",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        const granted1 = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: string.app_name,
            message:
              "App needs access to download file",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED
          && granted1 === PermissionsAndroid.RESULTS.GRANTED) {
          //console.log("You can use the camera");
          openFLowChart(currentSelect,locationName,sheetId,colIndex);
        } else {
          setSnackBarText("Sorry do not have permission to download file..");
          setVisibleSnackBar(true);
        }
      }
      else{
        openFLowChart(currentSelect,locationName,sheetId,colIndex);
      }
    } catch (err) {
      console.warn(err);
    }
  };


  const openFLowChart = async (currentSelect,locationName,sheetId,colIndex) => {
    try{
      //console.log('sheetId',sheetId)
      if(workflowName.length==0)
      {
        setSnackBarText("Please select damage mechanism");
        setVisibleSnackBar(true);
        return;
      }
      if(damageMechanism.length==0)
      {
        setSnackBarText("Please select damage mechanism");
        setVisibleSnackBar(true);
        return;
      }
      if(inspect.length==0)
      {
        setSnackBarText("Please select inspect");
        setVisibleSnackBar(true);
        return;
      }
      if(sheetId.length==0)
      {
        setSnackBarText("Please complete below option");
        setVisibleSnackBar(true);
        return;
      }
      const sheet = "sheet_" + sheetId;
      let tableUrl=string.url + `/api/blob/folder/sheetfile/read/${"admin"}/${workflowName}/${currentSelect}/${sheet}/${"table.json"}`;
      //console.log(tableUrl);
      const responseTable = await axios.get(tableUrl);
      let tableItem=responseTable.data.tableItem;
      let inspectArray=inspect.split("-");
      let tableIndex=0;
      for(let i=0;i<tableItem.length;i++)
      {
        let firstElement=tableItem[i].col[0].name;
        let secondElement=tableItem[i].col[1].name;
        let thirdElement=tableItem[i].col[2].name;
        if(firstElement===inspectArray[0])
        {
          if(secondElement===inspectArray[1])
          {
            if(thirdElement===inspectArray[2])
            {
              console.log('matching Id ' + tableItem[i])
              tableIndex=i;
            }
          }
        }
      }
      console.log('tableIndex',tableIndex);
      openFlowChartPdf(currentSelect,sheet,responseTable.data.tableItem[tableIndex],colIndex)
    }
    catch(e)
    {
      console.log(e);
    } 
  }

  const requestFileAccessPermissionFlowChartManual = async (currentSelect,locationName,sheetId,colIndex) => {
    try {
      if(Platform.OS=="android")
      {
        const OsVer = Platform.constants['Release'];
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: string.app_name,
            message:
              "App needs access to download file",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        const granted1 = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: string.app_name,
            message:
              "App needs access to download file",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED
          && granted1 === PermissionsAndroid.RESULTS.GRANTED) {
          //console.log("You can use the camera");
          openFLowChartManual(currentSelect,locationName,sheetId,colIndex);
        } else {
          setSnackBarText("Sorry do not have permission to download filnpm run androide..");
          setVisibleSnackBar(true);
        }
      }
      else{
        openFLowChartManual(currentSelect,locationName,sheetId,colIndex);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const openFLowChartManual = async (currentSelect,locationName,sheetId,colIndex) => {
    try{
      const sheet = "sheet_" + sheetId;
      let tableUrl=string.url + `/api/blob/folder/sheetfile/read/${"admin"}/${workflowName}/${currentSelect}/${sheet}/${"table.json"}`;
      console.log(tableUrl);
      const responseTable = await axios.get(tableUrl);
      let tableItem=responseTable.data.tableItem;
      let tableIndex=0;
      for(let i=0;i<tableItem.length;i++)
      {
        let firstElement=tableItem[i].col[0].name;
        if(firstElement===locationName)
        {
          console.log(firstElement,'===',locationName);
          console.log('tableItem',tableItem[i])
          tableIndex=i;
        }
      }
      //console.log('tableIndex',tableIndex);
      openFlowChartPdf(currentSelect,sheet,responseTable.data.tableItem[tableIndex],colIndex)
    }
    catch(e)
    {
      console.log(e);
    }
  }

  const openFlowChartPdf=(currentSelect,sheet,tableItem,colIndex)=>{
    console.log('tableIndex',JSON.stringify(tableItem));
    let rowno= tableItem.id;
    let colno= tableItem.col[colIndex].id;
    let link= tableItem.col[colIndex].uploadLink;
    let uploadName= tableItem.col[colIndex].uploadName;
    if(link.length==0)
    {
      setSnackBarText("Sorry file not found or invalid url..");
      setVisibleSnackBar(true);
      return false;
    }
    const rowx = "row_" + rowno;
    const colx = "col_" + colno;
    //https://nw01.cognivea.com/user/api/blob/folder/sheet/read/admin/Damage Mechanism/manual/sheet_2337240-d803-874e-702-260c6b55a18/row_eee8d30-f05e-dd62-82fc-ff7d2fd666c5/col_c4e0c4-a13-2221-c48-76325dfeca2/8c6b72c-823e-5c4-b77-2bcb00e5ae
    //https://nw01.cognivea.com/user/api/blob/folder/sheet/read/admin/Damage Mechanism/manual/sheet_2337240-d803-874e-702-260c6b55a18/row_eee8d30-f05e-dd62-82fc-ff7d2fd666c5/col_6de8afb-c71-b66e-02a-744376a6cd50/
    //https://nw01.cognivea.com/user/api/blob/folder/sheet/read/admin/Damage Mechanism/manual/sheet_2337240-d803-874e-702-260c6b55a18/row_053146d-78aa-4c26-85ad-03c6172f1c2d/col_1c4bd3-00f1-ac88-aa47-b3f475cbc34/563372-fe30-e740-602-c1e5866c463
    let downloadUrl=string.url+ `/api/blob/folder/sheet/read/${"admin"}/${workflowName}/${currentSelect}/${sheet}/${rowx}/${colx}/${link}`;
    console.log('downloadUrl',downloadUrl);
    console.log('uploadName',uploadName);
    let randomNumber=Math.floor(Math.random() * 100) + 1;
    const { dirs } = RNFetchBlob.fs;
    const dirToSave = Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir
    const pathToWrite = `${dirToSave}/${randomNumber+"_"+uploadName}`;
    //const responseDownload=await axios.get(downloadUrl, { responseType: "blob" }) 
    //console.log(pathToWrite);
    setVisibleChangeOptionConfirmation(true);
    setProgressBar(0.0);
    try{
      
      const configfb = {
          fileCache: true,
          //useDownloadManager: true,
          notification: true,
          //mediaScannable: true,
          //title: pdfInfo.pdf,
          //path: `${pathToWrite}`,
      }
      const configOptions = Platform.select({
          ios: {
              fileCache: configfb.fileCache,
              title: configfb.title,
              path: configfb.path,
          },
          android: configfb,
      });

      downloadUrl=downloadUrl.replace(" ","%20");;
      RNFetchBlob.config(configOptions)
      .fetch("GET", downloadUrl, {
        //some headers ..
      })
      .uploadProgress({ interval: 250 }, (written, total) => {
        //console.log("uploaded", written / total);
      })
      // listen to download progress event, every 10%
      .progress({ count: 1 }, (received, total) => {
        //console.log("progress", received / total);
        let pr=received / total;
        setProgressBar(pr);
      })
      .then((res) => {
        // the temp file path
        //console.log("The file saved to ", res.path());
        RNFetchBlob.fs.writeFile(pathToWrite, res.path(), 'uri')
        .then((res)=>{ 
          //console.log("The file saved to ", res);
          setVisibleChangeOptionConfirmation(false);
          Alert.alert(
            "Download",
            uploadName+" successfully downlaoded.\n\nDo you want to open this file ?",
            [
              {
                text: "Later",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "Open", onPress: () => openPdfFile(pathToWrite) }
            ]
          );
        })
        .catch((error) => {
          setVisibleChangeOptionConfirmation(false);
          console.log(error);
          setSnackBarText("Error 1 : Sorry you do not have permission to download this file please provide read write permission");
          setVisibleSnackBar(true);
        });
        
      })
      .catch((error) => {
        setVisibleChangeOptionConfirmation(false);
        console.log(error);
        setSnackBarText("Error : "+error);
        //setSnackBarText("Error : Sorry you do not have permission to download this file please provide read write permission");
        setVisibleSnackBar(true);
      });
      
      //console.log('responseDownload',responseDownload);
    }
    catch(e)
    {
      setVisibleChangeOptionConfirmation(false);
      console.log('responseDownload',e);
      //setSnackBarText(e);
      //setVisibleSnackBar(true);
      setSnackBarText("Sorry you do not have permission to download this file please provide read write permission");
      setVisibleSnackBar(true);
    }
  };

  const openPdfFile=(pathToWrite) => {
    //console.log(pathToWrite);
    FileViewer.open(pathToWrite, { showOpenWithDialog: true }) // absolute-path-to-my-local-file.
    .then(() => {
      // success
    })
    .catch((error) => {
      // error
      console.log(error);
    });
    // FileViewer.open(pathToWrite) // absolute-path-to-my-local-file.
    //   .then((res) => {
    //     console.log(res);
    //     // success
    //   })
    //   .catch((error) => {
    //     // error
    //     //console.log("3456"+error);
    //     setSnackBarText("No associated app found to open this file");
    //     setVisibleSnackBar(true);
    //   });
    //Linking.openURL(pathToWrite)
  };


  const openRefrenceSheet = async () => {
    try{
      const sheet = "sheet_" + refrenceSheetId;
      //https://nw01.cognivea.com/user/api/blob/folder/sheetfile/read/admin/Damage%20Mechanism/reference/sheet_618edb0-df21-7036-1001-d6a22edb631/table.json
      let tableUrl=string.url + `/api/blob/folder/sheetfile/read/${"admin"}/${workflowName}/reference/${sheet}/${"table.json"}`;
      //console.log(tableUrl);
      const responseTable = await axios.get(tableUrl);
      let tableItem=responseTable.data.tableItem;
      setRefrenceSheetData(tableItem);
      //console.log('tableIndex',tableIndex);
      //openFlowChartPdf(currentSelect,sheet,responseTable.data.tableItem[tableIndex],colIndex)
    }
    catch(e)
    {
      console.log(e);
    } 
  }

  const requestFileAccessPermissionTraining = async () => {
    try {
      setTrainingResultData([]);
      if(Platform.OS=="android")
      {
        const OsVer = Platform.constants['Release'];
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: string.app_name,
            message:
              "App needs access to download file",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        const granted1 = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: string.app_name,
            message:
              "App needs access to download file",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED
          && granted1 === PermissionsAndroid.RESULTS.GRANTED) {
          //console.log("You can use the camera");
          openTraining();
        } else {
          setSnackBarText("Sorry do not have permission to download file..");
          setVisibleSnackBar(true);
        }
      }
      else{
        openTraining();
      }
    } catch (err) {
      console.warn(err);
    }
  };


  const openTraining = async () => {
    try{
      const sheet = "sheet_" + isTrainingSwitch;
      //https://nw01.cognivea.com/user/api/blob/folder/sheetfile/read/admin/Damage%20Mechanism/manual/sheet_2337240-d803-874e-702-260c6b55a18/table.json
      let tableUrl=string.url + `/api/blob/folder/sheetfile/read/${"admin"}/${workflowName}/manual/${sheet}/${"table.json"}`;
      console.log(tableUrl);
      const responseTable = await axios.get(tableUrl);
      //console.log('responseTable',JSON.stringify(responseTable.data));
      setTrainingResultData([]);
      let data=responseTable.data.tableItem;
      let colHead=data[0].col;
      for(let i=1;i<data.length;i++)
      {
        let colData=data[i].col;
        let tempArray=[];
        for(let j=2;j<colData.length;j++)
        {
          let dt={
            name:colHead[j].name,
            value:colData[j].name,
            col:colData[j].id,
            row:data[i].id,
            link:colData[j].uploadLink,
            uploadName:colData[j].uploadName,
          };
          tempArray.push(dt);
        }
        console.log('tempArray',tempArray);
        setTrainingResultData((trainingResultData) => [
          ...trainingResultData,
          {
            name:colData[0].name,
            subname:colData[1].name,
            data:tempArray,
          },
        ]);
      }
      console.log('trainingResultData',trainingResultData);
      //openFlowChartPdf(currentSelect,sheet,responseTable.data.tableItem[tableIndex],colIndex)
    }
    catch(e)
    {
      console.log(e);
    } 
  }

  const openTrainingChartPdf=(rowno,colno,link,uploadName)=>{
    //https://nw01.cognivea.com/user/api/blob/folder/sheet/read/admin/Damage%20Mechanism/manual/sheet_2337240-d803-874e-702-260c6b55a18/row_053146d-78aa-4c26-85ad-03c6172f1c2d/col_1a4a0d-7d80-1dad-c8b1-53e7eca81/0061f8-f5b-c2e4-abb4-d4f0df1db
    const sheet = "sheet_" + isTrainingSwitch;
    if(link.length==0)
    {
      setSnackBarText("Sorry file not found or invalid url..");
      setVisibleSnackBar(true);
      return false;
    }
    const rowx = "row_" + rowno;
    const colx = "col_" + colno;
    let downloadUrl=string.url+ `/api/blob/folder/sheet/read/${"admin"}/${workflowName}/manual/${sheet}/${rowx}/${colx}/${link}`;
    console.log('downloadUrl',downloadUrl);
    console.log('uploadName',uploadName);
    let randomNumber=Math.floor(Math.random() * 100) + 1;
    const { dirs } = RNFetchBlob.fs;
    const dirToSave = Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir
    const pathToWrite = `${dirToSave}/${randomNumber+"_"+uploadName}`;
    //const responseDownload=await axios.get(downloadUrl, { responseType: "blob" }) 
    //console.log(pathToWrite);
    setVisibleChangeOptionConfirmation(true);
    setProgressBar(0.0);
    try{
      
      const configfb = {
          fileCache: true,
          //useDownloadManager: true,
          notification: true,
          //mediaScannable: true,
          //title: pdfInfo.pdf,
          //path: `${pathToWrite}`,
      }
      const configOptions = Platform.select({
          ios: {
              fileCache: configfb.fileCache,
              title: configfb.title,
              path: configfb.path,
          },
          android: configfb,
      });

      downloadUrl=downloadUrl.replace(" ","%20");;
      RNFetchBlob.config(configOptions)
      .fetch("GET", downloadUrl, {
        //some headers ..
      })
      .uploadProgress({ interval: 250 }, (written, total) => {
        //console.log("uploaded", written / total);
      })
      // listen to download progress event, every 10%
      .progress({ count: 1 }, (received, total) => {
        //console.log("progress", received / total);
        let pr=received / total;
        setProgressBar(pr);
      })
      .then((res) => {
        // the temp file path
        //console.log("The file saved to ", res.path());
        RNFetchBlob.fs.writeFile(pathToWrite, res.path(), 'uri')
        .then((res)=>{ 
          //console.log("The file saved to ", res);
          setVisibleChangeOptionConfirmation(false);
          Alert.alert(
            "Download",
            uploadName+" successfully downlaoded.\n\nDo you want to open this file ?",
            [
              {
                text: "Later",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "Open", onPress: () => openPdfFile(pathToWrite) }
            ]
          );
        })
        .catch((error) => {
          setVisibleChangeOptionConfirmation(false);
          console.log(error);
          setSnackBarText("Error 1 : Sorry you do not have permission to download this file please provide read write permission");
          setVisibleSnackBar(true);
        });
        
      })
      .catch((error) => {
        setVisibleChangeOptionConfirmation(false);
        console.log(error);
        setSnackBarText("Error : "+error);
        //setSnackBarText("Error : Sorry you do not have permission to download this file please provide read write permission");
        setVisibleSnackBar(true);
      });
      
      //console.log('responseDownload',responseDownload);
    }
    catch(e)
    {
      setVisibleChangeOptionConfirmation(false);
      console.log('responseDownload',e);
      //setSnackBarText(e);
      //setVisibleSnackBar(true);
      setSnackBarText("Sorry you do not have permission to download this file please provide read write permission");
      setVisibleSnackBar(true);
    }
  };

  const backToTraining = () => {
    setIsTrainingSwitch("");
    setTrainingResultData([]);
  };

  if(isLoading )
  {
    return <Loader title={loaderText}/>
  }
  if(activityIndicate){
    return(<Loader title={"Validating"}/>)
  }
 async function onClickChangePassword(){
  console.log(tempValuePassword,tempValue1,tempValue2,"tempValues")
  try {
    // const res1= await axios.post("https://nw01.cognivea.com/user/rpc.UserService/ChangePassword",{ currentPassword:tempValuePassword, newPassword:tempValue2 });
    // console.log(res1,"res1")
    const res= await axios.post("https://nw01.cognivea.com/rpc.UserService/ChangePassword",{ currentPassword:tempValuePassword, newPassword:tempValue2 },{headers: {'Authorization': `Bearer ${name.token}`}})
    console.log("response SUccessfull",res)
    Alert.alert("Success","Password changed successfully",[
      {
        text:"Ok"
      }
    ])
    navigation.replace("Login")
  } catch (error) {
    console.log(error)
  Alert.alert("Error!","Authorization Error",[
    {
      text:"Ok"
    }
  ])
  }
 }

  function onClickChangePasswordrequest(){

    if(tempValue1!==tempValue2){
      Alert.alert("Error!","Passwords Don't Match",[
        {
          text:"OK"
        }
      ])
    }
    else{
      onClickChangePassword()
    }

  }
  function Alert1(){
    let title="Error!"
    let msg ="Cannot process your request, Please try After sometime"
    Alert.alert(title,msg,[
      {
        text:"Ok"
      }
    ])
  }
  function Alert11(){
    let title1="Success!"
    let msg1="Account Deleted Successfully"
    Alert.alert(title1,msg1,[
      {
        text:"Ok"
      }
    ])
  }
  async function onClickDeleteAccount(){
    console.log(tempValuePassword,"------------------")
    console.log(userId,"userId----------------------")
    let pass=tempValuePassword
     try{
      if(tempValueUserName!==name){
        Alert.alert("Error!","Invalid Credentials",[
          {
            text:"OK"
          }
        ])
      
      return(0)
      }
      else if(tempValuePassword!==passwordValue){
        Alert.alert("Error!","Invalid Credentials",[
          {
            text:"OK"
          }
        ])
        return(0)
      }
       const res= axios.post("https://nw01.cognivea.com/user/rpc.UserService/DeleteAccount",{ userId:userId, password: pass })

     async function tryLogin(){
      try{
      const resCheckLogin= await axios.post(string.url+'/rpc.AuthService/Login', { name:name, password:passwordValue });
      console.log(resCheckLogin,"responseForCheckingAfterDeleteIngAccount")
      setActivityIndicate(false)
      setTimeout( Alert1,200)
     
      }
      catch(error){
        setTimeout(Alert11,200)
        
        navigation.replace("Login")
      }
      
    } 

   function tryLogin1(){
    
    tryLogin()
   }
    function setTimeTryLogin(){
      setActivityIndicate(true)
      setTimeout(tryLogin1,2000)
    }
    setTimeTryLogin()

    // Alert.alert("Sucess","Account Deleted Successfully",[
    //   {
    //     text:"OK"
    //   }
    // ])
  }
  catch(error){
    console.log(error,"error")
  
  }
  }
  function onClickDeleteAccountRequest(){
    console.log("deleteAccountCalled")
    Alert.alert("Confirmation","You are going to delete your NDEWhiz account ! Are you sure you want to continue?",
    [
      {
        text:"Yes,Delete This Account"
        ,
        onPress: ()=>{
          onClickDeleteAccount()
        }
      },

      {
        text:"Cancel",
        onPress:()=>{console.log("cancelPressed")}
      }
    ])
  }
  return (
    <SafeAreaView style={{flex: 1}}>


      <StatusBar barStyle='dark-content' animated={true} showHideTransition='slide' backgroundColor='black' style={{backgroundColor:colors.primary}} />
      <Appbar.Header style={{backgroundColor:colors.primary,marginTop: (Platform.OS === 'ios') ? -45 : 0}}>
        <Appbar.Content title="Dashboard" color='white'/>
        <Appbar.Action icon={"dots-vertical"} color='white'  onPress={()=>{setShowModalUserDetails(true)}}/>

        <Appbar.Action icon="exit-to-app" onPress={() => clearSessionData()} color='white' />
      </Appbar.Header>

      <Modal
        animationType="slide"
        
        visible={showModalUserDetails}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          // setModalVisible(!modalVisible);
          setShowModalUserDetails(false)
 
        
        }}>
          <Appbar>
            <Appbar.Content title="User Account Details" style={{fontWeight:"bolder",}}></Appbar.Content>
            <Appbar.Action icon={"close"} onPress={()=>{setShowModalUserDetails(false)}}></Appbar.Action>
          </Appbar>
        <View style={styles.centeredView}>
          <DataTable style={styles.tableUserDetails}>
            <DataTable.Header>
              <DataTable.Title></DataTable.Title>
              <DataTable.Title></DataTable.Title>

            </DataTable.Header>
            <DataTable.Row onHoverIn={(e) => { e.target.style.backgroundColor = "grey" }}>
              <DataTable.Cell style={styles.tableCell}><Text style={{ fontWeight: "bold" }} >
                {"E-mail"}
              </Text>
              </DataTable.Cell>
              <DataTable.Cell style={styles.tableCell}>
                <Text style={{ fontFamily: "sans-serif", fontStyle: "italic" }}> {"info@xaaslabs.com"}</Text>
              </DataTable.Cell>

            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell style={styles.tableCell}>
                <Text style={{ fontWeight: "bold" }}>{"Username"}</Text>
              </DataTable.Cell>
              <DataTable.Cell style={styles.tableCell}>
                <Text>{name}</Text>

              </DataTable.Cell>

            </DataTable.Row>
            <DataTable.Row style={{ height: 100 }}>
              <DataTable.Cell style={styles.tableCell}>
                <Text style={{ fontWeight: "bold" }}>{"Password"}</Text>

              </DataTable.Cell>
              <DataTable.Cell style={styles.tableCell}>
                <View style={{ display: "flex", flexDirection: "column" }}>
                  <View>
                    <HideUnhidePassword label="password" value={passwordValue} onChange={setPasswordValue} height={32}></HideUnhidePassword>
                  </View>
                  <View>
                    <Button mode='contained' buttonColor="grey" compact="true" onPress={() => { setShowModalChangePassword(true); setShowModalUserDetails(false) }}>Change Password</Button>
                  </View>
                </View>
                {/* <Button mode='contained' buttonColor='grey' >Change Password</Button> */}


              </DataTable.Cell>

            </DataTable.Row>

          </DataTable>
         <View style={{textAlign:"center",marginTop:40}}><Button onPress={()=>{setShowModalDeleteAccount(true);setShowModalUserDetails(false)}}
       buttonColor='#2196F3'
       mode='contained'
      >Delete Account</Button></View>
          {/* <View style={styles.modalView}>
            <Text style={styles.modalText}>Hello World!</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setShowModalUserDetails(false)}>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View> */}
        </View>
      </Modal>


      <Modal visible={showModalDeleteAccount} onRequestClose={()=>{setShowModalDeleteAccount(false)} } animationType="slide"
      >
        <Appbar>
          <Appbar.Content title="Delete Account" ></Appbar.Content>
          <Appbar.Action icon={"close"} onPress={()=>{setShowModalDeleteAccount(false);setShowModalUserDetails(true)}}></Appbar.Action>
        </Appbar>
        <View style={styles.modalView} >
          <View style={{ margin: 10 }}>
          <Text
                    style={{
                      fontSize: 28,
                      fontWeight: '500',
                      color: '#333',
                      textAlign:'center',
                      marginBottom: 30
                    }}>
                  {/* Username */}
                   Credentials
                  </Text>
            <TextInput
              mode="outlined"
              label="Username"
              placeholder="Enter Username"

              keyboardType='email-address'
              style={{ width: 200 }}
              onChangeText={(e)=>{setTempValueUserName(e)}}
            />
          </View>
          <View style={{ margin: 10 }}><TextInput
            mode='outlined'
            label={"password"}
            placeholder="Enter Current Password"
            secureTextEntry={true}
            style={{ width: 200 }}
            onChangeText={(e)=>{setTempValuePassword(e)}}
          ></TextInput>
          </View>
          <View style={{textAlign:"center",marginTop:10}}>
            <Button icon={"delete"} onPress={()=>{onClickDeleteAccountRequest()}} buttonColor="#f44931" mode='contained'>Delete Account</Button>
          </View>

        </View>
      </Modal>



      <Modal
        animationType='slide'
        visible={showModalChangePassword}
        onRequestClose={() => { setShowModalChangePassword(false); setShowModalUserDetails(true) }}
      >
        <Appbar>
          <Appbar.Content title="Password Change"></Appbar.Content>
          <Appbar.Action icon={"close"} onPress={() => { setShowModalChangePassword(false); setShowModalUserDetails(true) }}></Appbar.Action>
        </Appbar>
        <View >
        <View style={styles.modalView}>
          <View style={{ textAlign: "center" }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: '500',
                color: '#333',
                textAlign: 'center',
                marginBottom: 30,
                marginTop: 10
              }}>
              {/* Username */}
              Enter Credentials
            </Text>
            <View style={{ textAlign: "center" }}>
              <TextInput
                mode='outlined'
                label={"Current Password"}
                placeholder="Enter Current Password"
                secureTextEntry={true}
                onChangeText={(e) => { setTempValuePassword(e) }}
              ></TextInput></View>
            <View style={{ textAlign: "center" }}>
              <TextInput
                mode='outlined'
                label={"New Password"}
                secureTextEntry={true}
                onChangeText={(e) => { setTempValue1(e) }}
              ></TextInput></View>
            <View style={{ textAlign: "center" }}>
              <TextInput
                mode='outlined'
                label={"Re-type New Password"}
                secureTextEntry={true}
                onChangeText={(e) => { setTempValue2(e) }}
              ></TextInput></View>


            <Button icon={"key"} onPress={() => { onClickChangePasswordrequest() }} style={{ margin: 10 }} buttonColor="green" mode='contained' compact={true}>Change Password</Button>

          </View>
        </View>
        </View>
      </Modal>


      <View style={{flex:1,justifyContent: 'space-between'}}>
        <View style={{padding:10}}>
          <Text style={styles.headerTextLg}>Welcome {name}</Text>
          <Divider theme={theme} />
          <View style={{flexDirection:'column'}}>
            <ScrollView>
              <View style={{marginBottom:50}}>
                <Text>Workflow Name</Text>
                <DropDownPicker
                  open={openWorkflowName}
                  value={workflowName}
                  items={itemsWorkflowName}
                  setOpen={setOpenWorkflowName}
                  setValue={setWorkflowName}
                  setItems={setItemsWorkflowName}
                  dropDownDirection="BOTTOM"
                  listMode="SCROLLVIEW"
                  placeholder='Select Workflow Name'
                  zIndex={10000}
                  onChangeValue={(value) => workflowNameChangeHandler(value)}
                  style={styles.dropdown}
                />
                <Divider />

                <Text>Damage Mechanisms</Text>
                <DropDownPicker
                  open={openDamageMechanism}
                  value={damageMechanism}
                  items={itemsDamageMechanism}
                  setOpen={setOpenDamageMechanism}
                  setValue={setDamageMechanism}
                  setItems={setItemsDamageMechanism}
                  dropDownDirection="BOTTOM"
                  listMode="SCROLLVIEW"
                  placeholder='Select Damage Mechanisms'
                  zIndex={9000}
                  onChangeValue={(value) => damageMechanismChangeHandler(value)}
                  style={styles.dropdown}
                />
                <Divider />

                <Text>Inspect</Text>
                <DropDownPicker
                  open={openInspect}
                  value={inspect}
                  items={itemsInspect}
                  setOpen={setOpenInspect}
                  setValue={setInspect}
                  setItems={setItemsInspect}
                  dropDownDirection="BOTTOM"
                  listMode="SCROLLVIEW"
                  placeholder='Select Inspect'
                  zIndex={8000}
                  onChangeValue={(value) => inspectChangeHandler(value)}
                  style={styles.dropdown}
                />
                <Divider />

                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                  <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                    <RadioButton 
                    status={ workflowRadioButton === 'Workflow' ? 'checked' : 'unchecked' }
                    onPress={() => setWorkflowRadioButton('Workflow')}
                    value="Workflow" />
                    <Text>Workflow</Text>
                  </View>
                  <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                    <RadioButton 
                    status={ workflowRadioButton === 'Training' ? 'checked' : 'unchecked' }
                    onPress={() => setWorkflowRadioButton('Training')}
                    value="Training" />
                    <Text>Training</Text>
                  </View>
                  <View style={{flexDirection:'row',alignItems:'center'}}>
                    <RadioButton 
                    style=""
                    status={ workflowRadioButton === 'Reference' ? 'checked' : 'unchecked' }
                    onPress={() => setWorkflowRadioButton('Reference')}
                    value="Reference" />
                    <Text>Reference</Text>
                  </View>
                </View>
                {workflowRadioButton=='Workflow' && (
                  <View>
                    { subComponentData.length>0 && (
                      <View style={{flexDirection:'column',width:'100%'}}>
                        <Button mode="elevated" style={{marginTop:10,width:'100%'}} onPress={() => resetData()}>
                          Reset
                        </Button>
                        <Button mode="elevated" style={{marginTop:10,width:'100%'}} onPress={() => requestFileAccessPermissionFlowChart('flowchart',outerItemSheetName,outerItemSheetId,5)}>
                          Global Effectiveness Table (DM)
                        </Button>
                      </View>
                    )}
                    {noForkflowSequence==true && (
                      <Text style={{textAlign:'center',color:'red',fontSize:20}}>No Workflow Sequence,Reset to continue...</Text>
                    )}

                    <FlatList
                      data={locInformationSubItem}
                      renderItem={(outerItem) => (
                        <Card mode='elevated' style={{backgroundColor: 'blue',margin:5}}>
                          <View style={{flex:1,flexDirection:'row',width:'100%',backgroundColor:colors.accent,padding:10}}>
                            <Text style={{color:'white'}}>NDE Information</Text>
                          </View>
                          <View style={{flex:1,flexDirection:'column',padding:5}}>
                            <View style={{flex:1,flexDirection:'row',width:'100%',margin:5}}>
                              <Text style={{width:'40%',color:'white',textAlignVertical:'center'}}>Reference</Text>
                              <Chip style={{alignItems:'center'}} icon="sitemap" onPress={() => requestFileAccessPermissionFlowChart('flowchart',outerItem.item.subName,outerItem.item.sheetId,4)}>Flow Chart</Chip>
                            </View>
                            <View style={{flex:1,flexDirection:'row',width:'100%',margin:5}}>
                              <Text style={{width:'40%',color:'white',textAlignVertical:'center'}}>Navigated Path</Text>
                              <Chip style={{alignItems:'center'}} icon="information" onPress={() => console.log('Pressed')}>View</Chip>
                            </View>
                            <View style={{flex:1,flexDirection:'row',width:'100%',margin:5}}>
                              <Text style={{width:'40%',color:'white',textAlignVertical:'center'}}>{outerItem.item.name}</Text>
                              <Chip style={{alignItems:'center'}} icon="map-marker-radius" onPress={() => requestFileAccessPermission(outerItem.item.subName,outerItem.item.sheetSpreadSheetId)}>{outerItem.item.subName}</Chip>
                            </View>
                            <View style={{flex:1,flexDirection:'row',width:'100%',margin:5}}>
                              <Text style={{width:'40%',color:'white',textAlignVertical:'center'}}>NDE Intro Session</Text>
                              <Chip style={{alignItems:'center'}} icon="download" onPress={() => requestFileAccessPermissionFlowChart('flowchart',outerItem.item.subName,outerItem.item.sheetId,6)}>Download</Chip>
                            </View>
                          </View>
                        </Card>
                      )}
                      //onEndReachedThreshold={0.5}
                      //onEndReached={()=> setVisibleSnackBar(true)}
                    />

                    <FlatList
                      data={ndeInformationSubItem}
                      renderItem={(outerItem) => (
                        <Card mode='elevated' style={{backgroundColor: colors.primary,margin:5}}>
                          <View style={{flex:1,flexDirection:'row',width:'100%',backgroundColor:colors.accent,padding:10}}>
                            <Text style={{color:'white'}}>NDE Method : {outerItem.item.name}</Text>
                          </View>
                          <View style={{flex:1,flexDirection:'column',padding:5}}>
                            <View style={{flex:1,flexDirection:'row',width:'100%',margin:5}}>
                              <Text style={{width:'40%',color:'white',textAlignVertical:'center'}}>NDE Sub Method	</Text>
                              <Chip style={{alignItems:'center'}} icon="view-list" onPress={() => requestFileAccessPermissionFlowChartManual('manual',outerItem.item.subName,outerItem.item.sheetId,2)}>{outerItem.item.subName}</Chip>
                            </View>
                            <View style={{flex:1,flexDirection:'row',width:'100%',margin:5}}>
                              <Text style={{width:'40%',color:'white',textAlignVertical:'center'}}>Effectiveness Table</Text>
                              <Chip style={{alignItems:'center'}} icon="information" onPress={() => requestFileAccessPermissionFlowChartManual('manual',outerItem.item.subName,outerItem.item.sheetId,3)}>View</Chip>
                            </View>
                            <View style={{flex:1,flexDirection:'row',width:'100%',margin:5}}>
                              <Text style={{width:'40%',color:'white',textAlignVertical:'center'}}>Manufacturer</Text>
                              <Chip style={{alignItems:'center'}} icon="information" onPress={() => requestFileAccessPermissionFlowChartManual('manual',outerItem.item.subName,outerItem.item.sheetId,4)}>View</Chip>
                            </View>
                            <View style={{flex:1,flexDirection:'row',width:'100%',margin:5}}>
                              <Text style={{width:'40%',color:'white',textAlignVertical:'center'}}>Service Provider</Text>
                              <Chip style={{alignItems:'center'}} icon="information" onPress={() => requestFileAccessPermissionFlowChartManual('manual',outerItem.item.subName,outerItem.item.sheetId,5)}>View</Chip>
                            </View>
                            <View style={{flex:1,flexDirection:'row',width:'100%',margin:5}}>
                              <Text style={{width:'40%',color:'white',textAlignVertical:'center'}}>Company Procedures	</Text>
                              <Chip style={{alignItems:'center'}} icon="information" onPress={() => requestFileAccessPermissionFlowChartManual('manual',outerItem.item.subName,outerItem.item.sheetId,6)}>View</Chip>
                            </View>
                            <View style={{flex:1,flexDirection:'row',width:'100%',margin:5}}>
                              <Text style={{width:'40%',color:'white',textAlignVertical:'center'}}>Training Docs</Text>
                              <Chip style={{alignItems:'center'}} icon="download" onPress={() => requestFileAccessPermissionFlowChartManual('manual',outerItem.item.subName,outerItem.item.sheetId,7)}>Download</Chip>
                            </View>
                            <View style={{flex:1,flexDirection:'row',width:'100%',margin:5}}>
                              <Text style={{width:'40%',color:'white',textAlignVertical:'center'}}>Technical Note</Text>
                              <Chip style={{alignItems:'center'}} icon="information" onPress={() => requestFileAccessPermissionFlowChartManual('manual',outerItem.item.subName,outerItem.item.sheetId,8)}>View</Chip>
                            </View>
                          </View>
                          
                        </Card>
                      )}
                      //onEndReachedThreshold={0.5}
                      //onEndReached={()=> setVisibleSnackBar(true)}
                    />

                    <FlatList
                      ListEmptyComponent={(
                        <Button mode="outlined" style={{marginTop:10}} onPress={() => setData()}>
                          Start
                        </Button>
                      )}
                      data={subComponentData}
                      renderItem={(outerItem) => (
                        <Card mode='elevated' style={{backgroundColor: outerItem.item.color,padding:10,margin:5}}>
                          <View style={{flex:1,flexDirection:'row',height:80,width:'100%'}}>
                            <Text variant='bodyLarge' style={{marginTop:15,width:'30%',color:'white'}}>{outerItem.item.name} : </Text>
                            <View style={{alignItems:'flex-end',width:'70%'}}>
                              <View style={{flexDirection:'row',height:80}}>
                              <FlatList
                                ListEmptyComponent={(
                                  <Button mode="contained-tonal" style={{marginTop:10}} onPress={() => changeOptionConfirmation(outerItem.item.id)}>
                                    {outerItem.item.value}
                                  </Button>
                                )}
                                numColumns={3}
                                data={outerItem.item.subItem}
                                renderItem={(innerItem) => (
                                  <Button mode="contained-tonal" style={{marginTop:10}} onPress={() => setSubData(innerItem.item.name,innerItem.item.item,innerItem.item.link,innerItem.item.type)}>
                                    {innerItem.item.name}
                                  </Button>
                                )}
                              />
                              </View>
                            </View>
                          </View>
                        </Card>
                      )}
                    />
                  </View>
                )}
                {workflowRadioButton=='Training' && (
                  <View>
                  {trainingResultData.length==0 && (
                    <View>
                      {isTrainingSwitch.length>0 && (
                        <View>
                          <Button mode="contained-tonal" style={{marginTop:10}} onPress={() => requestFileAccessPermissionTraining()}>
                            View Sheet
                          </Button>
                          <FlatList
                            style={{marginTop:10}}
                            data={trainingData}
                            renderItem={(outerItem) => (
                              <View mode='elevated' style={{backgroundColor: outerItem.item.rowstr==0 ? colors.accent : colors.white}}>
                                {outerItem.item.rowstr==0 && (
                                  <View style={{flex:1,flexDirection:'row',width:'100%',padding:10,margin:1}}>
                                    <Text style={{color:'white',width:'70%'}}>{outerItem.item.col[0].name}</Text>
                                    <Text style={{color:'white',width:'30%',textAlign:'center'}}>{outerItem.item.col[1].name}</Text>
                                  </View>
                                )}
                                {outerItem.item.rowstr>0 && (
                                  <View style={{flex:1,flexDirection:'row',width:'100%',padding:10,margin:1}}>
                                    <Text style={{color:colors.primary,width:'70%',textAlignVertical:'center'}}>{outerItem.item.col[0].name}</Text>
                                    <Button style={{alignItems:'flex-end'}} icon="open-in-new" mode="outlined" onPress={() => Linking.openURL(outerItem.item.col[1].name)}>
                                      Open
                                    </Button>
                                  </View>
                                )}
                                <Divider />
                              </View>
                            )}
                          />
                        </View>
                      )}
                      <FlatList
                        data={trainingData}
                        renderItem={(outerItem) => (
                          <Card mode='elevated' style={{backgroundColor: colors.white,margin:5}}>
                            <View style={{flex:1,flexDirection:'row',width:'100%',padding:10}}>
                              <Switch value={isTrainingSwitch===outerItem.item.id ? true : false} onValueChange={()=>onToggleTrainingSwitch(outerItem.item.id)} />
                              <Text style={{color:colors.primary}}>{outerItem.item.name}</Text>
                            </View>
                          </Card>
                        )}
                      />
                    </View>
                  )}
                  {trainingResultData.length>0 && (
                    <View>
                      <Button mode="contained-tonal" style={{marginTop:10}} onPress={() => backToTraining()}>
                        Back
                      </Button>
                      <FlatList
                        data={trainingResultData}
                        renderItem={(outerItem) => (
                          <Card mode='elevated' style={{backgroundColor: colors.primary,margin:10}}>
                            <View style={{flex:1,flexDirection:'row',width:'100%',backgroundColor:colors.accent,padding:10}}>
                              <Text style={{color:'white'}}>{outerItem.item.name} - {outerItem.item.subname}</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'column',padding:5}}>
                              <FlatList
                                data={outerItem.item.data}
                                renderItem={(innerItem) => (
                                  <View style={{flex:1,flexDirection:'row',width:'100%',margin:5}}>
                                    <Text style={{width:'85%',color:'white',textAlignVertical:'center'}}>{innerItem.item.name}</Text>
                                    <IconButton
                                      icon="download"
                                      mode='contained'
                                      iconColor={colors.primary}
                                      size={20}
                                      onPress={() => openTrainingChartPdf(innerItem.item.row,innerItem.item.col,innerItem.item.link,innerItem.item.uploadName)}
                                    />
                                  </View>
                                )}
                              />
                            </View>
                          
                          </Card>
                        )}
                      />
                      
                    </View>
                  )}
                </View>
                )}
                {workflowRadioButton=='Reference' && (
                  <View>
                    <FlatList
                      data={refrenceData}
                      renderItem={(outerItem) => (
                        <Card mode='elevated' style={{backgroundColor: colors.white,margin:5}}>
                          <View style={{flex:1,flexDirection:'row',width:'100%',padding:10}}>
                            <Switch value={isRefrenceSwitch} onValueChange={()=>onToggleSwitch(outerItem.item.id)} />
                            <Text style={{color:colors.primary}}>{outerItem.item.name}</Text>
                          </View>
                        </Card>
                      )}
                    />
                    {isRefrenceSwitch==true && (
                      <View>
                        <Button mode="contained-tonal" style={{marginTop:10}} onPress={() => openRefrenceSheet()}>
                          View Sheet
                        </Button>
                        <FlatList
                        style={{marginTop:10}}
                          data={refrenceSheetData}
                          renderItem={(outerItem) => (
                            <View mode='elevated' style={{backgroundColor: outerItem.item.rowstr==0 ? colors.accent : colors.white}}>
                              {outerItem.item.rowstr==0 && (
                                <View style={{flex:1,flexDirection:'row',width:'100%',padding:10,margin:1}}>
                                  <Text style={{color:'white',width:'70%'}}>{outerItem.item.col[0].name}</Text>
                                  <Text style={{color:'white',width:'30%',textAlign:'center'}}>{outerItem.item.col[1].name}</Text>
                                </View>
                              )}
                              {outerItem.item.rowstr>0 && (
                                <View style={{flex:1,flexDirection:'row',width:'100%',padding:10,margin:1}}>
                                  <Text style={{color:colors.primary,width:'70%',textAlignVertical:'center'}}>{outerItem.item.col[0].name}</Text>
                                  <Button style={{alignItems:'flex-end'}} icon="open-in-new" mode="outlined" onPress={() => Linking.openURL(outerItem.item.col[1].name)}>
                                    Open
                                  </Button>
                                </View>
                              )}
                              <Divider />
                            </View>
                          )}
                        />
                      </View>
                    )}
                  </View>
                )}
                
              </View>
            </ScrollView>
          </View>
          <Portal>
            <Dialog dismissable={false} visible={visibleChangeOptionConfirmation} onDismiss={() => setVisibleChangeOptionConfirmation(false)}>
              <Dialog.Title style={{textAlign:'center'}}>Downloading...</Dialog.Title>
              <Dialog.Content>
                <ProgressBar progress={progressBar} color={colors.primary} />
              </Dialog.Content>
            </Dialog>
          </Portal>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding:10,
  },
  headerTextLg: {
    textAlign: "left",
    fontSize: 20,
    color: "black",
    color:colors.primary,
    fontWeight: 'bold',
    textAlign:"center"
  },
  headerTextSm: {
    textAlign: "left",
    fontSize: 14,
    color: "black",
    color:colors.primary
  },
  horizentalLine:{
    borderBottomColor: colors.divider,
    borderBottomWidth: 1,
  },
  dropdown: {
    marginTop:5,
    marginBottom:5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

    marginTop:120
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  tableCell:{

    padding:5
  }
});

export default DashboardScreen;
