import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { colors, colorsToEmoji } from "../../constants";
import * as Clipboard from "expo-clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StatNumber = ({ number, label }) => (
  <View style={styles().statnum}>
    <Text style={styles().number}>{number}</Text>
    <Text style={styles().label}>{label}</Text>
  </View>
);

const GuessDistributionLine = ({ position, amount, percentage }) => {
  return (
    <View style={styles().GDL}>
      <Text style={styles().GDLtext}>{position}</Text>
      <View style={styles(percentage).GDLine}>
        <Text style={styles().GDLtext}>{amount}</Text>
      </View>
    </View>
  );
};

const GuessDistribution = ({ distribution }) => {
  if (!distribution) {
    return;
  }
  const sum = distribution.reduce((total, dist) => dist + total, 0);
  return (
    <>
      <Text style={styles().subtitle}>GUESS DISTRIBUTION </Text>
      <View style={{ width: "100%", padding: 20 }}>
        {distribution.map((dist, i) => (
          <GuessDistributionLine
            key={`dist${i}`}
            position={i + 1}
            amount={dist}
            percentage={(100 * dist) / sum}
          />
        ))}
      </View>
    </>
  );
};

const EndScreen = ({ gameState, rows, getBGColor }) => {
  const [secondsTillTomorrow, setSeconsTillTomorrow] = useState(0);
  const [played, setPlayed] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [curStreak, setCurStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [distribution, setDistribution] = useState([]);

  useEffect(() => {
    LoadState();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );

      setSeconsTillTomorrow((tomorrow - now) / 1000);
    };

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatSeconds = () => {
    const hours = Math.floor(secondsTillTomorrow / (60 * 60));
    const minutes = Math.floor((secondsTillTomorrow % (60 * 60)) / 60);
    const seconds = Math.floor(secondsTillTomorrow % 60);

    const h = hours < 10 ? `0${hours}` : hours;
    const m = minutes < 10 ? `0${minutes}` : minutes;
    const s = seconds < 10 ? `0${seconds}` : seconds;

    return `${h}:${m}:${s}`;
  };

  const shareScore = () => {
    const textMap = rows
      .map((row, i) =>
        row.map((cell, j) => colorsToEmoji[getBGColor(i, j)]).join("")
      )
      .filter((row) => row)
      .join("\n");
    const textToShare = `Wordle \n\n${textMap}`;
    Clipboard.setString(textToShare);
    Alert.alert("Score Copied", "You can share your score to social media ");
  };

  const LoadState = async () => {
    const dataString = await AsyncStorage.getItem("@game");
    let data;
    try {
      data = JSON.parse(dataString);
      console.log(data);
    } catch (e) {
      console.log("Couldn't parse state", e);
    }
    const keys = Object.keys(data);
    const values = Object.values(data);

    setPlayed(keys.length);

    const numberOfWins = values.filter(
      (game) => game.gameState === "won"
    ).length;
    setWinRate(Math.floor((100 * numberOfWins) / keys.length));

    let _curStreak = 0;
    let _maxStreak = 0;
    let prevDay = 0;
    keys.forEach((key) => {
      const day = parseInt(key.split("-")[1]);
      if (data[key].gameState === "won" && _curStreak === 0) {
        _curStreak += 1;
      } else if (data[key].gameState === "won" && prevDay + 1 === day) {
        _curStreak += 1;
      } else {
        if (_curStreak > _maxStreak) {
          _maxStreak = _curStreak;
        }
        _curStreak = data[key].gameState === "won" ? 1 : 0;
      }
      prevDay = day;
    });
    setCurStreak(_curStreak);
    setMaxStreak(_maxStreak);

    //guess distribution
    let dist = [0, 0, 0, 0, 0, 0];

    values.map((game) => {
      if (game.gameState === "won") {
        const tries = game.rows.filter((row) => row[0]).length;
        dist[tries - 1] = dist[tries - 1] + 1;
      }
    });
    setDistribution(dist);
    console.log(dist);
  };

  return (
    <View style={styles().container}>
      <Text style={styles().title}>{gameState ? "CONGRATS!" : "SORRY"}</Text>
      <Text style={styles().subtitle}>STATISTICS</Text>
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        <StatNumber number={played} label={"Played"} />
        <StatNumber number={winRate} label={"Win %"} />
        <StatNumber number={curStreak} label={"Cur Streak"} />
        <StatNumber number={maxStreak} label={"Max Streak"} />
      </View>
      <GuessDistribution distribution={distribution} />

      <View style={{ flexDirection: "row", padding: 10 }}>
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text style={{ color: colors.lightgrey }}>Next Wordle</Text>
          <Text
            style={{
              color: colors.lightgrey,
              fontSize: 25,
              fontWeight: "bold",
            }}
          >
            {formatSeconds()}
          </Text>
        </View>
        <Pressable
          onPress={shareScore}
          style={{
            flex: 1,
            backgroundColor: colors.primary,
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: colors.lightgrey, fontWeight: "bold" }}>
            Share
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = (p) =>
  StyleSheet.create({
    container: {
      width: "100%",
      alignItems: "center",
    },
    title: {
      fontSize: 25,
      color: "white",
      textAlign: "center",
      marginVertical: 20,
    },
    subtitle: {
      fontSize: 20,
      color: colors.lightgrey,
      textAlign: "center",
      marginVertical: 15,
      fontWeight: "bold",
    },
    statnum: {
      alignItems: "center",
      margin: 10,
    },
    number: {
      color: colors.lightgrey,
      fontSize: 40,
      fontWeight: "bold",
    },
    label: {
      color: colors.lightgrey,
      fontSize: 14,
    },
    GDL: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
    },
    GDLtext: {
      color: colors.lightgrey,
    },
    GDLine: {
      alignSelf: "stretch",
      backgroundColor: colors.grey,
      margin: 5,
      padding: 5,
      width: `${p}%`,
    },
  });

export default EndScreen;
