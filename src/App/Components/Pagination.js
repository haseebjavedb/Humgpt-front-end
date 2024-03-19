const Pagination = ({ currentPage, setCurrentPage, data, orgData }) => {
    const totalPages = data.length;
    return (
        <div className="row">
            <div className="col-md-6">
                <span>Page <span className="badge bg-primary">{ currentPage + 1 }</span> Showing { currentPage * 10 + 1 } - { Math.min((currentPage + 1) * 10, orgData.length) } of { orgData.length } Items</span>
            </div>
            <div className="col-md-6 text-right pr0">
                {/* <button onClick={() => setCurrentPage(0)} className="btn btn-outline-primary btn-sm">
                    <span>First Page</span>
                </button> */}
                <button disabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)} className="btn btn-outline-primary btn-sm ml10">
                    <em className="icon ni ni-chevron-left"></em>
                </button>
                {Array.from(Array(data.length).keys()).map((index) => {
                    if (currentPage === 0) {
                        if (index <= currentPage + 2) {
                            return (
                                <button onClick={() => setCurrentPage(index)} className={`btn ${currentPage === index ? 'btn-primary' : 'btn-outline-default'} btn-outline-default btn-sm ml5`}>
                                    <span>{index + 1}</span>
                                </button>
                            );
                        }
                    } else if (currentPage + 1 === totalPages) {
                        if (index >= currentPage - 2) {
                            return (
                                <button onClick={() => setCurrentPage(index)} className={`btn ${currentPage === index ? 'btn-primary' : 'btn-outline-default'} btn-outline-default btn-sm ml5`}>
                                    <span>{index + 1}</span>
                                </button>
                            );
                        }
                    } else {
                        if (index >= currentPage - 1 && index <= currentPage + 1) {
                            return (
                                <button onClick={() => setCurrentPage(index)} className={`btn ${currentPage === index ? 'btn-primary' : 'btn-outline-default'} btn-outline-default btn-sm ml5`}>
                                    <span>{index + 1}</span>
                                </button>
                            );
                        }
                    }
                    return null;
                })}
                <button disabled={(currentPage + 1) === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="btn btn-outline-primary btn-sm ml10">
                    <em className="icon ni ni-chevron-right"></em>
                </button>
                {/* <button onClick={() => setCurrentPage(totalPages - 1)} className="btn btn-outline-primary btn-sm ml10">
                    <span>Last Page</span>
                </button> */}
            </div>
        </div>
    )
}

export default Pagination;