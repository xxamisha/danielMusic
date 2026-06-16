//this has compontents that will have the play paudse features adn progress bar


//call the spotify api to get the current playing song and display it in the player component
import {pause} from './pause';
import {play} from './play';
import {progressBar} from './progressBar';
import React, { useEffect, useState } from 'react';
import axios from 'axios';