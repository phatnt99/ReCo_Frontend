import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Alert =  withReactContent(Swal);

const Fuct = {
    showCustomSccess: (message: string) => {
        return Alert.fire({
            title: 'Thông báo',
            titleText: message,
            icon: 'success',
            timer: 10000
        })
    },

    showCreateSuccess: () => {
        Alert.fire({
            title: 'Thông báo',
            titleText: 'Thêm thành công',
            icon: 'success',
            timer: 2000
        })
    },
    showUpdateSuccess: () => {
        Alert.fire({
            title: 'Thông báo',
            titleText: 'Cập nhật thành công',
            icon: 'success',
            timer: 2000
        })
    },
    showDeleteSuccess: () => {
        return Alert.fire({
            title: 'Thông báo',
            titleText: 'Xóa thành công',
            icon: 'success',
            timer: 2000
        })
    },
    showError: () => {
        Alert.fire(
            'Thông báo',
            'Có lỗi xảy ra, vui lòng thử lại!',
            'error'
        )
    }
}

export default Fuct;