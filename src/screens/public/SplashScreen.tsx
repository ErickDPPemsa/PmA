import React, { useEffect, useRef, useState } from 'react'
import { View, Animated, Easing } from 'react-native'
import { vh } from '../../config/Dimensions';
import { useAppSelector } from '../../app/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { rootPublicScreen } from '../../navigation/PublicScreens';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
// import { Alert } from '../../components/Alert';
import { useQuery } from '@tanstack/react-query';
import { CheckAuth } from '../../api/Api';
import { setUser } from '../../features/appSlice';

interface Props extends StackScreenProps<rootPublicScreen, 'SplashScreen'> { };
export const SplashScreen = ({ navigation }: Props) => {
    const anim = useRef(new Animated.Value(1)).current;
    const isDark: boolean = useAppSelector(state => state.app.theme.dark);
    const [token, setToken] = useState<string | undefined>(undefined);
    const dispatch = useDispatch();

    useQuery(['checkAuth'], () => CheckAuth(), {
        retry: 0,
        enabled: token ? true : false,
        onError: async err => {
            try {
                AsyncStorage.removeItem('token');
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: String(err),
                    onHide: () => start({ time: 0 }),
                });
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: String(error),
                    onHide: () => start({ time: 0 }),
                });
            }
        },
        onSuccess: data => {
            dispatch(setUser(data));
        },
    });

    const start = ({ time }: { time?: number }) => setTimeout(async () => {
        try {
            const open = await AsyncStorage.getItem('isWellcomeOff');
            console.log('cambiar screen');
            (open === 'true') ? navigation.replace('LogInScreen') : navigation.replace('IntroductionScreen');
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: String(error),
                onHide: () => start({ time: 0 }),
            });
        }
    }, time ?? 2000);

    Animated.loop(
        Animated.sequence([
            Animated.timing(anim, {
                toValue: 1.1,
                duration: 500,
                easing: Easing.ease,
                useNativeDriver: true,
            }),
            Animated.timing(anim, {
                toValue: 1,
                duration: 500,
                easing: Easing.ease,
                useNativeDriver: true,
            })
        ])
    ).start();

    useEffect(() => {
        AsyncStorage.getItem('token').then(async token => {
            if ((typeof token === 'string')) {
                setToken(token);
            } else { start({}); }
        }).catch(err => {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: String(err),
                onHide: () => start({ time: 0 }),
            });
        });
    }, []);


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {
                isDark
                    ?
                    <Animated.Image
                        style={{ borderWidth: 1, width: vh * 25, height: vh * 25, transform: [{ scale: anim, }] }}
                        source={require('../../assets/logo3.png')}
                    />
                    :
                    <Animated.Image
                        style={{ borderWidth: 1, width: vh * 25, height: vh * 25, transform: [{ scale: anim, }] }}
                        source={require('../../assets/logo4.png')}
                    />
            }
        </View>
    )
}
