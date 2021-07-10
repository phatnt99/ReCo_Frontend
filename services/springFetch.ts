export default function springFetch(url: string, options?: any, needAuthen?: boolean) {
    if(needAuthen) {
        const token = localStorage.getItem("auth");
        options.headers = {
            ...options.headers,
            'Authorization': "Bearer " + token
        }
    }
    return fetch(url, {...options, mode: 'cors'}).then((res) => {
        if(res.status == 204)
            return {
                status: 'update'
            }
        if(res.status == 401)
            return {
                status: 401
            }
        if(res.status == 200 || res.status == 201 || res.status == 400) {
            return res.json();
        }

        return {
            status: 500
        }
    })
        .then(data => data);
}