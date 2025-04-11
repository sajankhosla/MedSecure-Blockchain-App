import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  useColorScheme,
} from 'react-native';

import { Colors, Typography, SpacingSystem } from '../theme';

const { borderRadius, spacing } = SpacingSystem;

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export const TextInput: React.FC<InputProps> = ({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  onFocus,
  onBlur,
  ...rest
}) => {
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const [isFocused, setIsFocused] = useState(false);

  const showHelper = !error && helper;
  const textColor = Colors.text[colorScheme || 'light'].primary;
  const placeholderColor = Colors.text[colorScheme || 'light'].tertiary;
  
  const containerStyles = [
    styles.container,
    containerStyle,
  ];
  
  const inputContainerStyles = [
    styles.inputContainer,
    colorScheme === 'dark' && styles.inputContainerDark,
    isFocused && styles.inputContainerFocused,
    error && styles.inputContainerError,
  ];
  
  const inputStyles = [
    styles.input,
    colorScheme === 'dark' && { color: Colors.text.dark.primary },
    inputStyle,
  ];
  
  const labelStyles = [
    styles.label,
    colorScheme === 'dark' && { color: Colors.text.dark.secondary },
    error && styles.labelError,
    labelStyle,
  ];

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus && onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur && onBlur(e);
  };

  return (
    <View style={containerStyles}>
      {label && <Text style={labelStyles}>{label}</Text>}
      
      <View style={inputContainerStyles}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <RNTextInput
          style={inputStyles}
          placeholderTextColor={placeholderColor}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      
      {(error || showHelper) && (
        <Text style={[styles.helper, error ? styles.error : {}]}>
          {error || helper}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...Typography.subheadline,
    marginBottom: spacing.xs,
    color: Colors.text.light.secondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface.light,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.system.gray.light,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  inputContainerDark: {
    backgroundColor: Colors.surface.dark,
    borderColor: Colors.system.gray.dark,
  },
  inputContainerFocused: {
    borderColor: Colors.primary.light,
  },
  inputContainerError: {
    borderColor: Colors.system.red.light,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.text.light.primary,
    height: '100%',
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
  helper: {
    ...Typography.footnote,
    marginTop: spacing.xs,
    color: Colors.text.light.tertiary,
  },
  labelError: {
    color: Colors.system.red.light,
  },
  error: {
    color: Colors.system.red.light,
  },
});

export default TextInput; 