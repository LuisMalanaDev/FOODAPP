import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <View style={styles.phoneContainer}>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#F1F5F9' : '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 480 : undefined,
    height: '100%',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? {
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.08,
          shadowRadius: 24,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: '#E2E8F0',
        }
      : {}),
  },
});
