import { View, Text, StyleSheet, Button, TextInput, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios, { AxiosError } from "axios";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LogIn = () => {
  //checks if there's already a user that logged in
  useEffect(() => {
    const getKey = async () => {
      const value = await AsyncStorage.getItem("user");
      if (value !== null) {
        router.push("/home");
      }
    };

    getKey();
  }, []);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const login = async () => {
    try {
      let response = await axios.post("http://10.0.2.2:3000/api/login", {
        email,
        password,
      });

      if (response.status == 200) {
        await AsyncStorage.setItem("user", JSON.stringify(email));

        router.push("/home");
      }
    } catch (error) {
      //   Alert.alert("Error", error.data);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          onChangeText={(text: string) => setEmail(text)}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          onChangeText={(text: string) => setPassword(text)}
          value={password}
          secureTextEntry
        />

        <Button title="Login" onPress={() => login()} />
      </View>
    </SafeAreaView>
  );
};

export default LogIn;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});
