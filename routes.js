var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "fas fa-tachometer-alt",
    color: "#f5365c",
    layout: "/admin",
    isAdmin: false,
  },
  {
    path: "/restaurants",
    name: "Nhà Hàng",
    idx: 'restaurant',
    icon: "fas fa-store",
    color: "#ffd600",
    layout: "/auth",
    isAdmin: false
  },
  {
    path: "/tags",
    name: "Thẻ",
    icon: "fas fa-tags",
    color: "#11cdef",
    layout: "/auth",
    isAdmin: true
  },
  {
    path: "/vouchers",
    name: "Khuyến mãi",
    idx: 'voucher',
    icon: "fas fa-ticket-alt",
    color: "#2dce89",
    layout: "/auth",
    isAdmin: false
  }, 
  {
    path: "/reservations",
    name: "Đặt chỗ",
    idx: 'reservation',
    icon: "fas fa-utensils",
    color: "#5e72e4",
    layout: "/auth",
  },
  {
    path: "/comments",
    name: "Bình luận",
    idx: 'comment',
    icon: "fas fa-comments",
    color: "#f3a4b5",
    layout: "/auth",
    isAdmin: true
  },
  {
    path: "/reviews",
    name: "Bài đánh giá",
    idx: 'review',
    icon: "fas fa-glasses",
    color: "#5e72e4",
    layout: "/auth",
    isAdmin: false
  },
  {
    path: "/owners",
    name: "Đối tác",
    idx: 'owner',
    icon: "fas fa-handshake",
    color: "#fb6340",
    layout: "/auth",
    isAdmin: true
  },
  {
    path: "/diners",
    name: "Khách hàng",
    idx: 'diner',
    icon: "fas fa-utensils",
    color: "#5603ad",
    layout: "/auth",
    isAdmin: true
  },
  {
    path: "/reports",
    name: "Báo lỗi",
    idx: 'report',
    icon: "fas fa-flag",
    color: "#8898aa",
    layout: "/auth",
    isAdmin: false
  },
];
export default routes;
