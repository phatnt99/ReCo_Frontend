import springFetch from "./springFetch";
import spring from "../springRoute";

const restaurantService = {
  create: (restaurant) => {
    console.log("SEND");
    console.log(restaurant);
    let url = spring.restaurant;

    const payload = new FormData();

    for (let key in restaurant) {
      if (key == 'carousel' || key == 'menu') {
        let items = restaurant[key];
        for (let i = 0; i < items.length; i++) {
          console.log(items[i]);
          payload.append(key, items[i]);
        }
      }
      else {
        payload.append(key, restaurant[key]);
      }
    }

    return springFetch(url,
      {
        method: "POST",
        body: payload
      });
  },

  update: (restaurant) => {
    console.log("SEND UPDATE");
    console.log(restaurant);
    let url = spring.restaurant + restaurant.id;

    const payload = new FormData();

    for (let key in restaurant) {
      if (restaurant[key] == null)
        continue;

      if (key == 'carousel' || key == 'menu') {
        let items = restaurant[key];
        for (let i = 0; i < items.length; i++) {
          console.log(items[i]);
          payload.append(key, items[i]);
        }
      }
      else {
        payload.append(key, restaurant[key]);
      }
    }

    return springFetch(url,
      {
        method: "PUT",
        body: payload
      });
  },

  delete: (id: number) => {
    let url = `${spring.restaurant}/${id}`;

    return springFetch(url, {
      method: "DELETE"
    });
  },

  approve: (id: any, type: number) => {
    let url = `${spring.restaurant}/approve`;

    return springFetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        restaurantId: id,
        status: type
      })
    });
  },

  bapprove: (model: any[], type: any) => {
    let url = `${spring.restaurant}/bulk-approve`;

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

  bdelete: (model: any[]) => {
    let url = `${spring.restaurant}/bulk-delete`;

    return springFetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: model
      })
    })
  }
};

export default restaurantService;
