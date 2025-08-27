
import axios from "axios";
import telcoData from "../database/telco";

// Simulate Axios response for development
export const getChurnData = () => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ data: telcoData });
		}, 500);
	});
};
