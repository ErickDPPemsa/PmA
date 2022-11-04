import React, { useCallback, useEffect, useRef } from 'react';
import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, View, TextInput as NativeTextInput, Text, Button } from 'react-native';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Input } from '../../components/Input';
import { StackScreenProps } from "@react-navigation/stack";
import { rootPublicScreen } from '../../navigation/PublicScreens';
import { screenHeight, screenWidth, vh } from '../../config/Dimensions';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateTcyAp, updateInfo, updateError } from "../../features/alertSlice";
// import { Button, Text } from 'react-native-paper';
import { Loading } from '../../components/Loading';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CheckAuth, LogIn } from '../../api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from '../../features/appSlice';
import { User } from '../../interfaces/interfaces';
import Toast from 'react-native-toast-message';
// import { Alert } from '../../components/Alert';
import { fontsScale } from '../../config/fontsScale';

type InputsLogIn = {
    email: string,
    password: string,
}

interface Props extends StackScreenProps<rootPublicScreen, 'LogInScreen'> { };
export const LogInScreen = ({ navigation }: Props) => {
    const { theme: { dark: isDark, colors } } = useAppSelector(store => store.app);
    const { showTC } = useAppSelector(state => state.alerts.tcyap);
    const dispatch = useAppDispatch();
    const { control, handleSubmit, reset, setValue, formState } = useForm<InputsLogIn>({ defaultValues: { email: '', password: '' } });

    const { isLoading, mutate, data } = useMutation(['LogIn'], LogIn, {
        retry: 0,
        onError: async err => {
            dispatch(updateError({ open: true, msg: `${err}`, icon: true, title: 'Error' }));
        },
        onSuccess: async data => {
            if (data.termsAndConditions) {
                setLogIn(data);
            } else {
                dispatch(updateTcyAp({ open: true, showTC: { dismissable: false } }))
            }
        },
    });

    const { refetch } = useQuery(['Terms'], () => CheckAuth(data?.token), {
        retry: 0,
        enabled: false,
        onError: async err => {
            dispatch(updateError({ open: true, msg: JSON.stringify(err, null, 3) }));
        },
        onSuccess: async data => {
            setLogIn(data);
        },
    })

    const setLogIn = async (data: User) => {
        try {
            await AsyncStorage.setItem('token', data.token);
            dispatch(setUser(data));
        } catch (error) { dispatch(updateError({ open: true, icon: true, msg: JSON.stringify(error) })) }
    };

    const onSubmit: SubmitHandler<InputsLogIn> = async (data) => {
        mutate(data);
    };

    const a = useRef<NativeTextInput>(null);

    useEffect(() => {
        setValue('email', 'admin@pem-sa.com');
        setValue('password', '1234');
    }, [])

    useEffect(() => {
        if (showTC?.confirm) refetch();
    }, [showTC]);



    return (
        <ScrollView style={{ height: screenHeight, width: screenWidth }}>
            <View style={{ paddingHorizontal: 30, alignItems: 'center' }}>
                <Text style={[styles.title, fontsScale.headlineMedium]}>PEMSA monitoreo APP</Text>
                {
                    isLoading && <Loading />
                }
                <Image
                    source={require('../../assets/logo.png')}
                    style={[styles.img, isDark ? { ...styles.imgDark } : {}]}
                />
                <KeyboardAvoidingView style={styles.ContainerViewInputs}>

                    <Input
                        formInputs={control._defaultValues}
                        control={control}
                        name={'email'}
                        renderLefttIcon='account'
                        mode='outlined'
                        placeholder='ejemplo@correo.com o usuario'
                        keyboardType='email-address'
                        rules={{ required: { value: true, message: 'Campo requerido' } }}
                        label='correo'
                        returnKeyType='next'
                        onSubmitEditing={() => {
                            a.current?.focus();
                        }}
                    />
                    <Input
                        refp={a}
                        formInputs={control._defaultValues}
                        control={control}
                        name={'password'}
                        renderLefttIcon='lock'
                        mode='outlined'
                        keyboardType='default'
                        placeholder='**********'
                        rules={{ required: { value: true, message: 'Campo requerido' } }}
                        isPassword
                        label='contraseña'
                        onSubmitEditing={handleSubmit(onSubmit)}
                        returnKeyType='done'
                    />
                </KeyboardAvoidingView>
                <View style={styles.ContainerBtns}>
                    {/* <Button
                        style={styles.Btns}
                        icon={'login'}
                        mode='contained'
                        loading={false}
                        onPress={handleSubmit(onSubmit)}
                        disabled={false}
                        labelStyle={{ textTransform: 'uppercase' }}
                    > Iniciar Sesión </Button>
                    <Button
                        style={styles.Btns}
                        icon={'lock-question'}
                        mode='contained'
                        loading={false}
                        onPress={() => dispatch(updateInfo({ open: true, msg: 'Contacta a tu titular para recuperar tu contraseña' }))}
                        // onPress={() => { navigation.navigate('ForgetPasswordScreen') }}
                        disabled={false}
                    > Olvidé mi contraseña </Button> */}
                </View>
            </View>
            <Text onPress={() => dispatch(updateTcyAp({ open: true }))} style={{ ...fontsScale.bodyLarge, fontWeight: '700', marginVertical: 20, textAlign: 'center' }}>Términos y condiciones y aviso de privacidad</Text>
            <Text style={{ ...fontsScale.bodyLarge, fontWeight: '700', textAlign: 'center', paddingBottom: 15 }}>Versión: {'222'}</Text>
        </ScrollView>
    )
}

export const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        fontWeight: '700',
        paddingTop: 10
    },
    img: {
        width: '100%',
        height: vh * 40,
        resizeMode: 'contain',
    },
    imgDark: {
        width: '80%',
        height: vh * 40,
        resizeMode: 'contain',
        borderRadius: 10,
        opacity: .8
    },
    ContainerViewInputs: {
        width: '100%',
        paddingVertical: 20,
    },
    ContainerBtns: {
        paddingVertical: 10,
    },
    Btns: {
        marginVertical: 7,
    },
});
