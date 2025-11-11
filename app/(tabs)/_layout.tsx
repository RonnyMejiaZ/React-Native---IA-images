import { HomeIcon, InfoIcon } from "@/components/icons";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";

// const useUser = () => {
//   const [allow, setAllow] = useState(false);

//   useEffect(() => {
//     checkPermissions().then(setAllow);
//   }, []);

//   return allow;
// };
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "black",
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color }) => <InfoIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
