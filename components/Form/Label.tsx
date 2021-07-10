function Label(props) {

    return (
        <label
            className="form-control-label"
            htmlFor="res-district">
            {props.children}
        </label>
    );
}

export default Label;