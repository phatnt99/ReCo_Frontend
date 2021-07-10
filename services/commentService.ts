import springFetch from "./springFetch";
import spring from "../springRoute";

const ReviewService = {
    bulkDelete: (ids: any) => {
        let url = `${spring.admin.comment}/bulk-delete`;

        return springFetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bulkIds: ids
            })
        })
    },

    bulkApprove: (model, type) => {
        let url = `${spring.admin.comment}/bulk-approve`;

        return springFetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bulkIds: model,
                status: type
            })
        })
    }
}

export default ReviewService;