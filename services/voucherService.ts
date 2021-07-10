import springFetch from "./springFetch";
import spring from "../springRoute";

const VoucherService = {
    bulkDelete: (ids: any) => {
        let url = `${spring.voucher}/bulk-delete`;

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

    getNewImage(image: any) {
        const payload = new FormData();
        payload.append("image", image);
        let url = `${spring.image}`;
        return springFetch(url, {
            method: 'POST',
            body: payload
        });
    },

    create(data: any) {
        let url = `${spring.voucher}`;
        return springFetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

    },

    update(data: any) {
        let url = `${spring.voucher}`;
        return springFetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }
}

export default VoucherService;