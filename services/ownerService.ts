import springFetch from "./springFetch";
import spring from "../springRoute";

const OwnerService = {
    getAll: () => {
        let url = `${spring.owner}/all`;

        return springFetch(url);
    },

    bulkDelete: (ids: any) => {
        let url = `${spring.owner}/bulk-delete`;

        return springFetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ids: ids
            })
        })
    },

    bulkApprove: (model, type) => {
        let url = `${spring.owner}/bulk-approve`;

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

    editInfor: (newInfor) => {
        let url = `${spring.owner}`;

        return springFetch(url, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newInfor)
        })
    }
}

export default OwnerService;