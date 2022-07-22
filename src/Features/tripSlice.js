import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import debounce from 'lodash.debounce'
// const axios = require('axios')

const initialState = {
    title: "untitled",
    origin: false,
    destination: false,
    businessesSelected: [],
    waypoints: [],
    isLoading: false,
    _id: undefined,
}

export const saveTrip = createAsyncThunk(
    'trip/saveTrip',
    async (payload, thunkAPI) => {
        console.log("saving trip");
        const trip = thunkAPI.getState().trip
        const result = await fetch(
            'http://localhost:5000/user/savetrip', {
            mode: 'cors',
            credentials: 'include',
            method: "post",
            body: JSON.stringify({ trip }),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const response = await result.json()
        console.log(response)
        return response
    }
)


// export const fetchTrip = createAsyncThunk(
//     'trip/fetchTrip',
//     async (payload, thunkAPI) => {
//         const result = await fetch(
//             'http://localhost:5000/user/trip/' + payload, {
//             mode: 'cors',
//             credentials: 'include',
//             method: "get",
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//         })
//         const response = await result.json()
//         console.log(response)
//         return response
//     }
// )

export const fetchTrip = createAsyncThunk(
    'trip/fetchTrip',
    async (payload, thunkAPI) => {
        const trip = await 
            fetch(
                'http://localhost:5000/user/trip/' + payload, {
                mode: 'cors',
                credentials: 'include',
                method: "get",
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
        console.log(trip)
        const businessesSelected = trip.trips[0].businessesSelected
        const details = await Promise.all(
            businessesSelected.map((business) =>
                fetch('http://localhost:5000/businesses/' + business.id)
                .then((response) => response.json())
            )
        )
        console.log(details)
        return {...trip, businessesSelected: details}
    }
)





const tripSlice = createSlice({
    name: 'trip',
    initialState,
    reducers: {
        setOrigin: (state, { payload }) => {
            state.origin = payload
        },
        setDestination: (state, { payload }) => {
            state.destination = payload
        },
        setTitle: (state, { payload }) => {
            state.title = payload
        },
        add: (state, { payload }) => {
            console.log(payload)
            state.businessesSelected.push(payload)
        },
        remove: (state, { payload }) => {
            console.log(payload)
            state.businessesSelected = payload
        },
        setWaypoints: (state, { payload }) => {
            state.waypoints = payload
        }
    },
    extraReducers: {
        [saveTrip.pending]: (state) => {
            state.isLoading = true
        },
        [saveTrip.fulfilled]: (state, action) => {
            state._id = action.payload
            state.isLoading = false
        },
        [saveTrip.rejected]: (state) => {
            state.isLoading = false
            console.log("save trip failed")
        },


        [fetchTrip.pending]: (state) => {
            state.isLoading = true
        },
        [fetchTrip.fulfilled]: (state, action) => {
            state.isLoading = false
            // console.log(action.payload);
            // console.log(action.payload.trips[0]);

            const trip = action.payload.trips[0]
            //put fetched data into the redux store
            state.title = trip.title
            state.origin = trip.origin
            state.destination = trip.destination
            state.businessesSelected = action.payload.businessesSelected

        },
        [fetchTrip.rejected]: (state) => {
            state.isLoading = false
        },

    }
})



export const { setOrigin, setDestination, setTitle, setWaypoints, add, remove, setTripId } = tripSlice.actions;
export default tripSlice.reducer
