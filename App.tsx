import { Text, View, FlatList } from 'react-native'
import * as Location from 'expo-location'

import * as React from 'react'

function AddressInfo(props: Location.LocationGeocodedAddress) {
    return (
        <FlatList
            renderItem={({ item }) => <Text>{item.title}</Text>}
            data={[
                { id: props.city, title: props.city },
                { id: props.country, title: props.country },
                { id: props.name, title: props.name },
                { id: props.street, title: props.street },
            ]}
        />
    )
}

export default function App() {
    const [location, setLocation] = React.useState<Location.LocationObject | null>(null)
    const [geo, setGeo] = React.useState<Location.LocationGeocodedAddress | null>(null)

    async function addressLookup(coords: Location.LocationObjectCoords) {
        const geoAddress = await Location.reverseGeocodeAsync({
            latitude: coords.latitude,
            longitude: coords.longitude,
        })
        setGeo(geoAddress[0])
    }
    async function initializeLocation() {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            return
        }
        const location = await Location.getCurrentPositionAsync({})
        setLocation(location)
    }

    React.useEffect(() => {
        initializeLocation()
    }, [])
    React.useEffect(() => {
        if (location?.coords) {
            addressLookup(location.coords)
        }
    }, [location?.coords])
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text>My location is</Text>
            {geo && (
                <View className="h-20">
                    <AddressInfo {...geo} />
                </View>
            )}
        </View>
    )
}
