import React, { useState } from 'react';
import loading from './loading.png';
import axios from 'axios';

export default function Map(props) {

    return (
        <div>
            <img height="100%" width="100%" src={props.prev} />
        </div>
    )
}