import springFetch from "./springFetch";
import spring from "../springRoute";

const ReportService = {
    send: (data) => {
        let url = `${spring.report}`;

        return springFetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    }
}

export default ReportService;