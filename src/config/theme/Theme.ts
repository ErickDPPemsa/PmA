import { Theme } from '@react-navigation/native';
import Color from 'color';
import { ThemeState } from '../../interfaces/interfaces';
import { colors } from '../colors';
import { fontsScale } from '../fontsScale';

const lightTheme: ThemeState = {
  currentTheme: 'light',
  dark: false,
  fonts: { ...fontsScale },
  roundness: 5,
  colors: {
    primary: '#084F6A',
    background: 'white',
    card: 'white',
    text: 'black',
    border: 'black',
    notification: 'teal',
  }
}

const darkTheme: ThemeState = {
  currentTheme: 'dark',
  dark: true,
  fonts: { ...fontsScale },
  roundness: 5,
  colors: {
    primary: '#75CEDB',
    background: 'black',
    card: 'black',
    text: 'white',
    border: 'black',
    notification: 'teal',
  }
}


export { lightTheme, darkTheme };