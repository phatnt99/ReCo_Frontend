var root = "https://d37qwhg1wwqiqd.cloudfront.net";
var spring = {
  restaurant: `${root}/restaurants`,
  restaurantEdit: `${root}/restaurants/edit`,
  tag: `${root}/admin/tags`,
  tag2: `${root}/tags`,
  review: `${root}/reviews`,
  comment: `${root}/comments`,
  resource: `${root}/resources`,
  reservation: `${root}/reservations`,
  user: `${root}/users`,
  voucher : `${root}/vouchers`,
  report: `${root}/reports`,
  dashboard: `${root}/dashboard`,
  owner_dashboard: `${root}/dashboard/owner`, 
  owner: `${root}/users/t/owners`,
  diner: `${root}/users/t/diners`,
  owner_restaurant: `${root}/restaurants/owner`,
  onwer_review: `${root}/reviews/owner`,
  diner: `${root}/users/t/diners`,
  followR: `${root}/reviews/follow`,
  followRe: `${root}/restaurants/follow`,
  search_review: `${root}/search/review?query=`,
  search_restaurant: `${root}/search/restaurant?query=`,
  search_restaurant2: `${root}/search/restaurant/owner`,
  image: `${root}/upload-image`,
  admin: {
    tag: `${root}/admin/tags`,
    review: `${root}/admin/reviews`,
    comment: `${root}/admin/comments`,
    dinner: `${root}/admin/dinners`
  },
  ml: {
    distance: `${root}/ml/icb`,
    profile: `${root}/ml/pcb`
  },
  login: `${root}/login`,
  register: `${root}/register`,
  pwd: `${root}/pwd`,
  me: `${root}/me`
};

export default spring;
