import { Link } from "expo-router";
import { Pressable, ScrollView } from "react-native";
import { HomeIcon } from "../../components/icons";

import { styled } from "nativewind";
import { Screen } from "../../components/Screen";
const StyledPressable = styled(Pressable);

export default function About() {
  return (
    <Screen>
      <ScrollView>
        <Link asChild href="/">
          <StyledPressable className={`active:opacity-50`}>
            <HomeIcon/>
          </StyledPressable>
        </Link>
      </ScrollView>
    </Screen>
  );
}
