import React, { useEffect } from 'react';
import { Appearance, AppState, ColorSchemeName, useColorScheme } from 'react-native';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { PublicScreens } from './PublicScreens';
import { NavigationContainer } from '@react-navigation/native';
import Toast, { BaseToast, BaseToastProps } from 'react-native-toast-message';
import { colors as ColorsAlerts } from '../config/colors';
import { PrivateScreens } from './PrivateScreens';
import { updateTheme } from '../features/appSlice';
import { darkTheme, lightTheme } from '../config/theme/Theme';

const toastConfig = {
    success: (props: BaseToastProps) => {
        const { colors, fonts, dark } = useAppSelector(state => state.app.theme);
        return (
            <BaseToast
                {...props}
                style={{ borderLeftColor: ColorsAlerts.Success, backgroundColor: dark ? colors.primary : colors.background }}
                text1Style={{ fontSize: fonts.bodyLarge.fontSize, color: colors.primary }}
                text2Style={{ fontSize: fonts.bodyMedium.fontSize, color: colors.primary }}
            />
        )
    },
    error: (props: BaseToastProps) => {
        const { colors, fonts, dark } = useAppSelector(state => state.app.theme);
        return (
            <BaseToast
                {...props}
                style={{ borderLeftColor: ColorsAlerts.Error, backgroundColor: dark ? colors.primary : colors.background }}
                text1Style={{ fontSize: fonts.bodyLarge.fontSize, color: colors.primary }}
                text2Style={{ fontSize: fonts.bodyMedium.fontSize, color: colors.primary }}
            />
        )
    },
    info: (props: BaseToastProps) => {
        const { colors, fonts, dark } = useAppSelector(state => state.app.theme);
        return (
            <BaseToast
                {...props}
                style={{ borderLeftColor: ColorsAlerts.Info, backgroundColor: dark ? colors.primary : colors.background }}
                text1Style={{ fontSize: fonts.bodyLarge.fontSize }}
                text2Style={{ fontSize: fonts.bodyMedium.fontSize }}
            />
        )
    }
}

export const Root = () => {
    const { status: isAuth, theme } = useAppSelector((state) => state.app);
    const dispatch = useAppDispatch();
    const color: ColorSchemeName = useColorScheme();

    useEffect(() => {
        color === 'dark' ? dispatch(updateTheme(darkTheme)) : dispatch(updateTheme(lightTheme));
    }, [color]);
    // useEffect(() => {
    //     AppState.addEventListener('change', (status) => {
    //         if (status === 'active') {
    //             (Appearance.getColorScheme() === 'dark')
    //                 ? dispatch(updateTheme(darkTheme))
    //                 : dispatch(updateTheme(lightTheme));
    //         }

    //     })
    // }, []);

    return (
        <NavigationContainer theme={theme}>
            {(isAuth) ? <PrivateScreens /> : <PublicScreens />}
            <Toast config={toastConfig} visibilityTime={4000} />
            {/* <Alerts /> */}
        </NavigationContainer>
    )
}
