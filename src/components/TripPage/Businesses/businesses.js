import { BusinessCard } from "./businessCard"
import { Stack } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export const Businesses = (props) => {
    const { businesses, addToTrip, setActiveMarker} = props
    console.log(businesses);
    return (<>

            <Stack sx={{maxHeight: '100%', overflowY: 'auto'}}>
                
                {businesses.length === 0 ? (
                    <Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    businesses.map((hike, index) => (
                        <BusinessCard
                            index= {index}
                            img={hike.image_url}
                            name={hike.name}
                            location={hike.location.address1}
                            description={hike.categories[0].title}
                            star={hike.rating}
                            reviewCount={hike.review_count}
                            coordinates={hike.coordinates}
                            yelpID={hike.id}
                            addToTrip={addToTrip}
                            setActiveMarker={setActiveMarker}
                        />
                    ))
                )}

            </Stack>

        {/* </Stack> */}


    </>)
}