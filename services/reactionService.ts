import springFetch from "./springFetch";
import spring from "../springRoute";

const ReactionService = {
    restaurant: (userId, restaurantId, type) => {
        let url = spring.followRe;

        return springFetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                followableId: restaurantId,
                type: type
            })
        })
    },

    review: (userId, reviewId, type) => {
        let url = spring.followR;

        return springFetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                followableId: reviewId,
                type: type
            })
        })
    }
}

export default ReactionService;