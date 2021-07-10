import springFetch from "./springFetch";
import spring from "../springRoute";

const ReservationService = {
    approve: (model: any[], type: any) => {
        let url = `${spring.reservation}/bulk-approve`;

        return springFetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ids: model,
                type: type
            })
        })
    },

    delete: (model: any[]) => {
        let url = `${spring.reservation}/bulk-delete`;

        return springFetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ids: model
            })
        })
    }
}

export default ReservationService;