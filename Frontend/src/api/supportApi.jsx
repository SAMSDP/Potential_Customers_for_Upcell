
import axios from "axios";
import supportData from "../database/support";

// Simulate Axios response for development
export const getSupportTickets = () => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ data: supportData });
		}, 500);
	});
};
