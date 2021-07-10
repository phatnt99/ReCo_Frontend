import springFetch from "./springFetch";
import spring from "../springRoute";

const MLService = {
    updateRestaurantDistance: (restaurantId) => {
        let url = `${spring.ml.distance}?restaurantId=${restaurantId}`;
        return springFetch(url);
    },

    updateProfileDistance: (areas, tags, uid) => {
        let url = `${spring.ml.profile}`;
        return springFetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: uid,
                tagId: tags,
                areas: areas
            })
        });
    }
}

export default MLService;