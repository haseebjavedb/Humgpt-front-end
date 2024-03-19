const ChatGPTFormatter = ({ response, writing }) => {
    // Function to format response
    const formatResponse = (text) => {
      const boldText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      const italicText = boldText.replace(/\*(.*?)\*/g, '<em>$1</em>');
      return italicText.replace(/\n/g, '<br/>');
    };
  
    return (
      <div className="chat-gpt-formatter">
        <span dangerouslySetInnerHTML={{ __html: formatResponse(response) }} />
        {writing && <span className="cursor">|</span>}
      </div>
    );
  };
  
export default ChatGPTFormatter;