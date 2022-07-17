import { SearchOrigin, SearchDestination } from "../TripView/Places";
import ReactDOM from 'react-dom';
import { Backdrop, Button, Grid, Modal } from '@mui/material';
import { useSelector } from "react-redux";



const ContainerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    alignItems: 'center',
    bgcolor: 'background.paper',
    // border: '1px solid #000',
    boxShadow: 24,
    borderRadius: '12px',
    margin: 0,
    width: '70%',
};


export const EditOriginDestination = ({ setOpen }) => {
    const handleClose = () => {
        // check if user entered origin or destination
        // if (start && end) {
        //     setOpen(false)
        // }
        setOpen(false)

    }
    const start = useSelector((store) =>
        store.trip.origin
    )
    const end = useSelector((store) =>
        store.trip.destination
    )
    return ReactDOM.createPortal(<>
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={true}
            onClose={() => handleClose() }
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >

            <Grid container sx={ContainerStyle}>
                <Grid item xs={12} md={5} >
                    <SearchOrigin placeholder={start.name || "e.g. San Diego"} label="Origin" />
                </Grid>
                <Grid item xs={12} md={5}>
                    <SearchDestination placeholder={end.name || "e.g. Las Vegas"} label="Destination" />
                </Grid>
                <Grid item xs={12} md={2} sx={{textAlign:'right'}}>
                    <Button variant='contained' sx={{width:{xs: '100%', md:'auto'}}} onClick={() => handleClose()}>Plan Trip</Button>
                </Grid>
            </Grid>


        </Modal>
    </>, document.getElementById("portal"))
}