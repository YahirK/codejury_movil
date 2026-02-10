import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import {
    LoginScreen,
    RegisterScreen,
    DashboardEvaluadorScreen,
    DashboardEvaluadoScreen,
    EvaluacionScreen,
    RevisionArchivosScreen,
    ResumenEvaluacionScreen,
    CargaDocumentosScreen,
    ConfirmacionCargaScreen,
    DashboardAdminScreen,
} from '../screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                }}
            >
                {/* Auth Screens */}
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />

                {/* Evaluador Screens */}
                <Stack.Screen name="DashboardEvaluador" component={DashboardEvaluadorScreen} />
                <Stack.Screen name="Evaluacion" component={EvaluacionScreen} />
                <Stack.Screen name="RevisionArchivos" component={RevisionArchivosScreen} />
                <Stack.Screen name="ResumenEvaluacion" component={ResumenEvaluacionScreen} />

                {/* Evaluado Screens */}
                <Stack.Screen name="DashboardEvaluado" component={DashboardEvaluadoScreen} />
                <Stack.Screen name="CargaDocumentos" component={CargaDocumentosScreen} />
                <Stack.Screen name="ConfirmacionCarga" component={ConfirmacionCargaScreen} />

                {/* Admin Screens */}
                <Stack.Screen name="DashboardAdmin" component={DashboardAdminScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
