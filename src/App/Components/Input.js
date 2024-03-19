const TextInput = ({ label, value, onChange, error = null, cols = 6, placeholder = "", isSmall = false, isTextArea = false, rows=5 }) => {
    return (
        <div className={`col-md-${cols}`}>
            <div class="form-group">
                {label && <label class="form-label">{ label }</label>}
                <div class="form-control-wrap">
                    {!isTextArea && <input className={`form-control ${ isSmall ? 'form-control-sm' : '' }`} type="text" value={value} placeholder={placeholder ? placeholder : `Enter ${label}`} onChange={onChange} />}
                    {isTextArea && <textarea className="form-control" value={value} rows={rows} placeholder={placeholder ? placeholder : `Enter ${ label }`} onChange={onChange}></textarea>}
                    <small className="text-danger">{ error ? error[0] : '' }</small>
                </div>
            </div>
        </div>
    );
}

export default TextInput;