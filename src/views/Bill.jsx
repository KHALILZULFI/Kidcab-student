import React, { useState, useEffect } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    ScrollView,
    Image,
    StatusBar,
    BackHandler
} from "react-native";
import { useNavigation, useRoute, CommonActions } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { screenHeight, screenWidth, normal, bold, api_url, get_bill, regular, app_name, img_url, f_25, f_s, f_xs, f_m } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { Badge } from '@rneui/themed';
import axios from 'axios';

const Bill = (props) => {
    const navigation = useNavigation();
    const route = useRoute();
    const [loading, setLoading] = useState(false);
    const [on_load, setOnLoad] = useState(0);
    const [data, setData] = useState("");
    const [trip_id, setTripId] = useState(route.params.trip_id);
    const [from, setFrom] = useState(route.params.from);

    useEffect(() => {
        call_get_bill();
        BackHandler.addEventListener("hardwareBackPress", go_back);
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", go_back);
        };
    }, []);

    const handle_back_button_click = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "Home" }],
            })
        );
    }

    const go_back = () => {
        navigation.goBack();
    }

    const call_get_bill = () => {
        setLoading(true);
        axios({
            method: 'post',
            url: api_url + get_bill,
            data: { trip_id: trip_id }
        })
            .then(async response => {
                setLoading(false);
                setData(response.data.result)
                setOnLoad(1);
            })
            .catch(error => {
                setLoading(false);
                alert('Sorry something went wrong')
            });
    }

    const navigate_rating = (data) => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "Rating", params: { data: data } }],
            })
        );
    }

    const navigate_complaint_category = (trip_id) => {
        navigation.navigate("ComplaintCategory", { trip_id: trip_id });
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                backgroundColor={colors.theme_bg}
            />
            {on_load == 1 &&
                <ScrollView>
                    <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg, padding: 20, flexDirection: 'row' }}>
                        {from == 'trips' &&
                            <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '10%', alignItems: 'flex-start', justifyContent: 'center' }}>
                                <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
                            </TouchableOpacity>
                        }
                        <View style={{ width: '90%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text numberOfLines={1} style={{ color: colors.theme_fg_three, fontSize: f_25, fontFamily: regular }}><Text style={{ fontFamily: bold }}>{app_name}</Text> Receipt</Text>
                        </View>
                    </View>
                    <View style={{ padding: 20 }}>
                        <View style={{ width: '100%' }}>
                            <Text style={{ letterSpacing: 1.5, lineHeight: 40, color: colors.theme_fg_two, fontSize: f_25, fontFamily: regular, textAlign: 'center' }}>Dear <Text style={{ fontFamily: bold }}>{data.customer.first_name}</Text>, Thanks for using {app_name}</Text>
                            <View style={{ margin: 5 }} />
                            <Text style={{ color: colors.grey, fontSize: f_s, fontFamily: regular, textAlign: 'center' }}>We hope you enjoyed your ride</Text>
                        </View>
                        <View style={{ margin: 20 }} />
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '50%', alignItems: 'flex-start', justifyContent: 'center' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_25, fontFamily: bold }}>Total</Text>
                                    <View style={{ margin: 5 }} />
                                    <Icon type={Icons.MaterialIcons} name="credit-card" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                                </View>
                            </View>
                            <View style={{ width: '50%', alignItems: 'flex-end', justifyContent: 'center' }}>
                                <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_25, fontFamily: bold }}>{global.currency}{data.total}</Text>
                            </View>
                        </View>
                        <View style={{ margin: 5 }} />
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '50%', alignItems: 'flex-start', justifyContent: 'center' }}>
                                <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: normal }}>Ride Price</Text>
                            </View>
                            <View style={{ width: '50%', alignItems: 'flex-end', justifyContent: 'center' }}>
                                <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_s, fontFamily: normal }}>{global.currency}{(data.total) - (data.tip)}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', borderTopWidth: 0.5, borderColor: colors.grey, marginTop: 10, paddingTop: 10 }}>
                            <View style={{ width: '50%', alignItems: 'flex-start', justifyContent: 'center' }}>
                                <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: normal }}>Tip</Text>
                            </View>
                            <View style={{ width: '50%', alignItems: 'flex-end', justifyContent: 'center' }}>
                                <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_s, fontFamily: normal }}>{global.currency}{data.tip}</Text>
                            </View>
                        </View>

                    </View>
                    <View style={{ borderTopWidth: 1, marginTop: 10, marginBottom: 10, borderColor: colors.theme_fg_two, borderStyle: 'dashed' }} />
                    <View style={{ padding: 20 }}>
                        <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_m, fontFamily: normal }}>Booking Details</Text>
                        <View style={{ margin: 5 }} />
                        <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: regular }}>{data.trip_type_name} - {data.vehicle_type} | {data.distance} km</Text>
                        <View>
                            <View style={{ width: '100%', marginTop: 20 }}>
                                <TouchableOpacity activeOpacity={1} style={{ width: '100%' }}>
                                    <View style={{ flexDirection: 'row', width: '100%', height: 50 }}>
                                        <View style={{ width: '10%', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 4 }}>
                                            <Badge status="success" />
                                        </View>
                                        <View style={{ width: '90%', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                                            <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: regular }}>Pickup Address</Text>
                                            <View style={{ margin: 2 }} />
                                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: f_xs, fontFamily: regular }}>{data.actual_pickup_address}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                {data.trip_type != 2 &&
                                    <TouchableOpacity activeOpacity={1} style={{ width: '100%' }}>
                                        <View style={{ flexDirection: 'row', width: '100%', height: 50 }}>
                                            <View style={{ width: '10%', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 4 }}>
                                                <Badge status="error" />
                                            </View>
                                            <View style={{ width: '90%', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                                                <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: regular }}>Drop Address</Text>
                                                <View style={{ margin: 2 }} />
                                                <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: f_xs, fontFamily: regular }}>{data.actual_drop_address}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                    </View>
                    {from != 'home' &&
                        <View>
                            <View style={{ borderTopWidth: 1, marginTop: 10, marginBottom: 10, borderColor: colors.theme_fg_two, borderStyle: 'dashed' }} />
                            <View style={{ padding: 20 }}>
                                <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_m, fontFamily: normal }}>Need Help ?</Text>
                                <View style={{ margin: 5 }} />
                                <Text style={{ color: colors.grey, fontSize: f_xs, fontFamily: regular }}>Feel free register your complaint if you face any struggles in your trips, we will help you to rectify to give you best satisfaction. </Text>
                                <View style={{ margin: 5 }} />
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <TouchableOpacity onPress={navigate_complaint_category.bind(this, trip_id)} activeOpacity={1} style={{flexDirection:'row', borderWidth:0.5, borderRadius: 10, height: 45, alignItems: 'center', justifyContent: 'center', padding:10 }}>
                                        <Icon type={Icons.AntDesign} name="exclamationcircle" color={colors.theme_fg_two} style={{ fontSize: 20 }} />
                                        <View style={{ margin:5 }}/>
                                            <Text style={{ color: colors.theme_fg_two, fontSize: f_s, color: colors.theme_fg_two, fontFamily: bold }}>Support</Text>
                                        </TouchableOpacity>
                                    </View>
                            </View>
                        </View>
                    }
                    <View style={{ borderTopWidth: 1, marginTop: 10, marginBottom: 10, borderColor: colors.theme_fg_two, borderStyle: 'dashed' }} />
                </ScrollView>
            }
            {data.ratings == 0 && from == 'home' &&
                <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 100, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={handle_back_button_click.bind(this)} activeOpacity={1} style={{ width: '45%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontFamily: bold }}>Home</Text>
                    </TouchableOpacity>
                    <View style={{ width: '3%' }} />
                    <TouchableOpacity onPress={navigate_rating.bind(this, data)} activeOpacity={1} style={{ width: '45%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontFamily: bold }}>Write Review</Text>
                    </TouchableOpacity>
                </View>
            }
            {data.ratings == 0 && from == 'trips' &&
                <View style={{ position: 'absolute', bottom: 0, width: '90%', height: 100, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf:'center' }}>
                    <TouchableOpacity onPress={navigate_rating.bind(this, data)} activeOpacity={1} style={{ width: '100%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontFamily: bold }}>Write Review</Text>
                    </TouchableOpacity>
                </View>
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: screenHeight,
        width: screenWidth,
    },
});

export default Bill;