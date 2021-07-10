import springFetch from "./springFetch";
import spring from "../springRoute";

const UserService = {
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
        let url = `${spring.diner}`;

        return springFetch(url, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newInfor)
        })
    },

    updateProfile: (areas, tags, uid) => {
        let url = `${spring.diner}/profile`;

        return springFetch(url, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: uid,
                tagId: tags,
                areas: areas
            })
        })
    }
}

export default UserService;