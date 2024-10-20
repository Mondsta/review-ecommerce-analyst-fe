import { Snackbar } from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import { forwardRef, useState } from "react";

const useAlert = () => {

    const [snack, setSnack] = useState(false);
    const [alertType, setAlertType] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnack(false);
    };

    const showAlert = (type, message) => {
        setAlertType(type);
        setAlertMessage(message);
        setSnack(true);
    };

    const renderAlert = () => {
        switch (alertType) {
            case "success":
                return (
                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        open={snack}
                        autoHideDuration={5000}
                        onClose={handleCloseAlert}>
                        <Alert severity="success" onClose={handleCloseAlert}>
                            {alertMessage}
                        </Alert>
                    </Snackbar>
                );
            case "info":
                return (
                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        open={snack}
                        autoHideDuration={5000}
                        onClose={handleCloseAlert}>
                        <Alert severity="info" onClose={handleCloseAlert}>
                            {alertMessage}
                        </Alert>
                    </Snackbar>
                );
            case "warning":
                return (
                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        open={snack}
                        autoHideDuration={5000}
                        onClose={handleCloseAlert}>
                        <Alert severity="warning" onClose={handleCloseAlert}>
                            {alertMessage}
                        </Alert>
                    </Snackbar>
                );
            case "error":
                return (
                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        open={snack}
                        autoHideDuration={5000}
                        onClose={handleCloseAlert}>
                        <Alert severity="error" onClose={handleCloseAlert}>
                            {alertMessage}
                        </Alert>
                    </Snackbar>
                );
            case "infobanner":
                return (
                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        open={snack}
                        autoHideDuration={10000}
                        onClose={handleCloseAlert}>
                        <Alert severity="info" onClose={handleCloseAlert}>
                            {alertMessage}
                        </Alert>
                    </Snackbar>
                );
            default:
                return null;
        }
    };

    return {
        showAlert: showAlert,
        renderAlert: renderAlert
    };
};

export default useAlert;