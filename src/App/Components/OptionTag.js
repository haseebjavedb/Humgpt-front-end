const OptionTag = ({ option, onCancel }) => {
    return (
        <span className="badge bg-primary ml5">{ option } {onCancel && <span className="pointer" onClick={onCancel}><em class="icon ni ni-cross"></em></span>}</span>
    )
}

export default OptionTag;