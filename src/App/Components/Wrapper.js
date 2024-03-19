const Wrapper = ({content, width = 350}) => {
    return (
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: width }}>
            { content }
        </div>
    )
}

export default Wrapper;