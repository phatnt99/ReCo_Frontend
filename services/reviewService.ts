import springFetch from "./springFetch";
import spring from "../springRoute";

const ReviewService = {
    delete: (id) => {
        let url = `${spring.admin.review}/${id}`;

        return springFetch(url, {
            method: "DELETE"
        })
    }
}

export default ReviewService;