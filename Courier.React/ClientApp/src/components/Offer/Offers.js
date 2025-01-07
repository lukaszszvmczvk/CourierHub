import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Offer from './Offer';
import { useAuth0 } from "@auth0/auth0-react";
import { Box, styled } from '@mui/material';

const StyledBox = styled(Box)({
    background: 'linear-gradient(#755139, #feedca)',
});
function Offers() {

    const navigate = useNavigate();
    const location = useLocation()
    const offers = location.state?.offers;
    const inquiryData = location.state?.inquiry;
    const [acceptedOffer, setAcceptedOffer] = useState(null);
    const { isAuthenticated } = useAuth0();

    const onClickNextButton = () => {
        if (!isAuthenticated) {
            navigate("/login-page", { state: { acceptedOffer: acceptedOffer, inquiry: inquiryData } });
        }
        else {
            navigate("/sender-form", { state: { acceptedOffer: acceptedOffer, inquiry: inquiryData } });  
        }
    }

    // TODO: 
    // jak bedzie wiecej niz 1 oferta trzeba:
    // 1. mapowac tablice ofert na pojedyczne oferty
    // 2. dodac jakies id do kazdego buttona i w onclicku zmieniac style konkrentej oferty
    return (
        <div>
            <div className="offersCards">
                <Offer offer={offers} handleAcceptedOffer={setAcceptedOffer} />
            </div>
            {/*<div className="buttons">*/}
            {/*    <button onClick={goBackButtonClick} className="go-back-button">Go Back</button>*/}
            {/*</div>*/}
            <div className="container-forms-buttons">
                <button className="btn btn-danger" id="back-button" onClick={() => navigate(-1)}>Go back</button>
                <button className="btn btn-primary" disabled={acceptedOffer === null} id="next-button" onClick={onClickNextButton}>Next</button>
            </div>
        </div>
    );
}

export default Offers;