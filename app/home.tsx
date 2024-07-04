import { View, Text, Button, TextInput, Alert, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useNavigation } from "expo-router";
import * as Network from "expo-network";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";

const home = () => {
  const [ipAddress, setIpAddress] = useState<string | null | undefined>(null);

  const [searching, setSearching] = useState(false);

  const [geoDetails, setGeoDetails] = useState<any>();

  const [loggedUserIp, setLoggedUserIp] = useState<any>();

  const [history, setHistory] = useState<any>();

  //checks if there's already a user that logged in
  useEffect(() => {
    const getKey = async () => {
      const value = await AsyncStorage.getItem("user");
      if (value !== null) {
        router.back();
      }
    };
  }, []);

  const getIp = async (ip?: string) => {
    try {
      if (!ip) {
        const ipInfo = await Network.getIpAddressAsync(); // Await the Promise
        setIpAddress(ipInfo.toString());
        setLoggedUserIp(ipInfo.toString());
      } else {
        setIpAddress(ip);
      }
    } catch (error) {
      console.error("Error fetching IP address:", error); // Handle errors
    }
  };

  useEffect(() => {
    getIp();
  }, []);

  const getGeoDetails = async () => {
    try {
      const result = await axios.get(
        `http://ipinfo.io/${ipAddress}?token=44e7e7c5560411`
      );

      console.log("GEO DETAILS RESULT");
      console.log(result);

      setGeoDetails(result.data);

      const historyResult = await getHistory();

      //retrieve history
      if (!historyResult && ipAddress != loggedUserIp) {
        await AsyncStorage.setItem("history", JSON.stringify([result.data]));
      } else {
        const historyArray = await AsyncStorage.getItem("history");
        console.log("HISTORY ARRAY");
        console.log(historyArray);
        // historyArray?.push(result.data);
        // await AsyncStorage.setItem("history", JSON.stringify([result.data]));
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Invalid Ip");
      setIpAddress(loggedUserIp);
    }
  };

  useEffect(() => {
    getGeoDetails();
  }, [searching]);

  const getHistory = async () => {
    try {
      const result = await AsyncStorage.getItem("history");
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    console.warn("LOGGED OUT");
    router.back();
  };

  return (
    <SafeAreaView>
      <TextInput
        placeholder="Search for an ip Address"
        onChangeText={(text: string) => {
          setSearching(false);
          getIp(text);
        }}
        keyboardType="numeric"
        style={styles.textInput}
      />
      <Text
        onPress={() => {
          setSearching(true);
          getGeoDetails();
        }}
      >
        Search
      </Text>
      <Text>IP ADDRESS</Text>
      <Text>{ipAddress}</Text>
      <Text>Geo Details</Text>
      {geoDetails && (
        <View style={styles.geoDetails}>
          <Text style={styles.text}>{geoDetails?.city}</Text>
          <Text style={styles.text}>Country</Text>
          <Text style={styles.text}>{geoDetails.country}</Text>
          <Text style={styles.text}>Postal ID</Text>
          <Text style={styles.text}>{geoDetails.postal}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  textInput: {
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
  },
  geoDetails: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  button: {
    marginTop: 10,
  },
});
