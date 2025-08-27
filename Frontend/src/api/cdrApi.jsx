
import axios from "axios";

// Mock data import (replace with real API call when backend is ready)
import cdrData from "../database/cdr";

// Simulate Axios response for development
export const getCDRData = () => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ data: cdrData });
		}, 500); // Simulate network delay
	});
};
