import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen        from './screens/WelcomeScreen';
import LoginScreen          from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import RegisterScreen       from './screens/RegisterScreen';
import HomeScreen           from './screens/HomeScreen';
import GamificationScreen   from './screens/GamificationScreen';
import DashboardScreen      from './screens/DashboardScreen';
import EducationScreen      from './screens/EducationScreen';
import AgregarScreen        from './screens/AgregarScreen';
import EducationDetailScreen from './screens/EducationDetailScreen';
import ProfileScreen         from './screens/ProfileScreen';
import EditProfileScreen     from './screens/EditProfileScreen';
import AdminDashboardScreen  from './screens/AdminDashboardScreen';
import AdminUsersScreen      from './screens/AdminUsersScreen';

class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    render() {
        if (this.state.hasError) {
            return (
                <ScrollView style={{ flex:1, backgroundColor:'#1a1a2e', padding:20, paddingTop:60 }}>
                    <Text style={{ color:'#FF6B6B', fontSize:18, fontWeight:'bold', marginBottom:16 }}>🔴 Error</Text>
                    <Text style={{ color:'#FFE66D', fontSize:13 }}>{this.state.error?.message}</Text>
                </ScrollView>
            );
        }
        return this.props.children;
    }
}

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <ErrorBoundary>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Welcome"        component={WelcomeScreen} />
                    <Stack.Screen name="Login"          component={LoginScreen} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                    <Stack.Screen name="Register"       component={RegisterScreen} />
                    <Stack.Screen name="Home"         component={HomeScreen}         options={{ animation: 'none' }} />
                    <Stack.Screen name="Gamification" component={GamificationScreen} options={{ animation: 'none' }} />
                    <Stack.Screen name="Dashboard"    component={DashboardScreen}    options={{ animation: 'none' }} />
                    <Stack.Screen name="Education"    component={EducationScreen}    options={{ animation: 'none' }} />
                    <Stack.Screen name="Agregar"      component={AgregarScreen}      options={{ animation: 'none' }} />
                    <Stack.Screen name="EducationDetail" component={EducationDetailScreen} options={{ animation: 'none' }} />
                    <Stack.Screen name="Profile"       component={ProfileScreen}        options={{ animation: 'none' }} />
                    <Stack.Screen name="EditProfile"   component={EditProfileScreen}    options={{ animation: 'none' }} />
                    <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen}  options={{ animation: 'none' }} />
                    <Stack.Screen name="AdminUsers"     component={AdminUsersScreen}       options={{ animation: 'none' }} />
                </Stack.Navigator>
            </NavigationContainer>
        </ErrorBoundary>
    );
}