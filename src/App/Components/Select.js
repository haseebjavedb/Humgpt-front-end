const SelectInput = ({ label, value, onChange, error = null, cols = 6, options, isObject = false, optionValue = null, optionLabel = null }) => {
    return (
        <div className={`col-md-${cols}`}>
            <div class="form-group">
                <label class="form-label">{ label }</label>
                <div class="form-control-wrap">
                    <select className="form-control" value={value} onChange={onChange}>
                        <option value={''} disabled>Choose Option</option>
                        {!isObject && options.map((option, index) => <option key={index} value={option}>{ option }</option>)}
                        {isObject && options.map((option, index) => <option key={index} value={option[optionValue]}>{ option[optionLabel] }</option>)}
                    </select>
                    <small className="text-danger">{ error ? error[0] : '' }</small>
                </div>
            </div>
        </div>
    );
}

export default SelectInput;