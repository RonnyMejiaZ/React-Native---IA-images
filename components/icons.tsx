import { Pressable } from "react-native";
import { styled } from "nativewind";
import { Entypo } from "@expo/vector-icons";
import type { ComponentProps } from 'react';

type EntypoIconProps = Omit<ComponentProps<typeof Entypo>, 'name'>;

const StyledPressable = styled(Pressable);

export const CircleInfoIcon = (props: EntypoIconProps ) => (
  <Entypo name="info-with-circle" size={24} color="white" {...props} />
);

export const HomeIcon = (props: EntypoIconProps) => (
  <Entypo name="home" size={24} color="white" {...props} />
);


export const InfoIcon = (props: EntypoIconProps) => (
  <Entypo name="info" size={24} color="white" {...props} />
);

export const MoreIcon = (props: EntypoIconProps) => (
  <Entypo name="circle-with-plus" size={24} color="white" {...props} />
);

export const LeftIcon = (props: EntypoIconProps) => (
  <Entypo name="chevron-left" size={24} color="white" {...props} />
);

export const RightIcon = (props: EntypoIconProps) => (
  <Entypo name="chevron-right" size={24} color="white" {...props} />
);