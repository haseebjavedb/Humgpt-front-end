const APIResponse = ({ response, writing = false, onlyFirstPara = false }) => {
    // Format the response text
    let formattedResponse = response.replace(/```/g, '');
    
    // formattedResponse = response.replace(/\\n/g, '\n');
    formattedResponse = response.replace(/\\n/g, '\n').replace(/\\"/g, '\"');

    // Split the formatted response into separate paragraphs
    let paragraphs = formattedResponse.split('\n');

    return (
        <div>
            {/* <p key={index}>{ paragraph }dangerouslySetInnerHTML={{ __html: paragraph }}</p> */}
            {(response && !onlyFirstPara) && paragraphs.map((paragraph, index) => (
                <p key={index}>{ paragraph }
                    {(paragraphs.length - 1 === index && writing) && <button style={{ height: 10, width: 10, border: '1px solid #21A1F6',borderRadius: 5, background: '#21A1F6' }}></button>}
                </p>
            ))}
            {onlyFirstPara && <p>{ paragraphs[0] }</p>}
        </div>
    );
}

export default APIResponse;

