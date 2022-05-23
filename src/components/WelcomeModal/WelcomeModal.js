import { useState, useEffect } from 'react';
import { StartPlaces, EndPlaces } from "../TripView/Places";
import ReactDOM from 'react-dom';
import { Backdrop, Box, Modal } from '@mui/material';

const ContainerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: 'center',
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    borderRadius: '12px',
    margin: 0,
};


export const WelcomeModal = () => {
    const [open, setOpen] = useState(true)

    return ReactDOM.createPortal(<>
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={() => setOpen(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Box sx={ContainerStyle} >
                <StartPlaces />
                <EndPlaces />
            </Box>
        </Modal>
    </>, document.getElementById("portal"))
}