import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as StoreProvider } from "react-redux";
import { store } from './app/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Root } from './navigation/Root';

export const App = () => {
  const queryClient = new QueryClient();

  return (
    <StoreProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <Root />
      </QueryClientProvider>
    </StoreProvider>
  )
}

export const styles = StyleSheet.create({
  full: {
    flex: 1,
  }
});
