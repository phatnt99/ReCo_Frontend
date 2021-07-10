import springFetch from "./springFetch";
import spring from "../springRoute";

const TagService = {

    create: (data) => {
        console.log("POST");
        console.log(data);
        let url = `${spring.tag}`;

        return springFetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: data
            })
        });
    },

    update: (id, data) => {
        let url = `${spring.tag}/${id}`;

        return springFetch(url, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: data
            })
        });
    },

    delete: (id) => {
        let url = `${spring.tag}/${id}`;

        return springFetch(url, {
            method: "DELETE"
        })
    }
}

export default TagService;