import { useState, useRef } from 'react';

const StreamingComponent = () => {
  const [userInput, setUserInput] = useState('');
  const [responseContent, setResponseContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const streamingTextElement = useRef(null);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const startStream = () => {
    setResponseContent(''); // Reset the previous content
    setCurrentIndex(0); // Reset the index

    const url = `//127.0.0.1:8000/api/chat-response?input=${encodeURIComponent(userInput)}`;

    const source = new EventSource(url);

    const typeCharacter = () => {
      if (currentIndex < responseContent.length) {
        setCurrentIndex(prevIndex => prevIndex + 1);
        setTimeout(typeCharacter, 100);
      }
    };

    source.onmessage = (event) => {
        console.log("Event", event);
        try {
            if(event.data){
                const data = JSON.parse(event.data.trim());
          
                if (data.id) {
                  const choices = data.choices;
                  if (choices && choices.length > 0) {
                    const content = choices[0].delta.content;
                    if (content) {
                      setResponseContent(prevContent => prevContent + content);
                      typeCharacter();
          
                      if (streamingTextElement.current) {
                        streamingTextElement.current.scrollTop = streamingTextElement.current.scrollHeight;
                      }
                    }
                  }
                } else if (data === '[DONE]') {
                  console.log('All data received:', responseContent);
                  source.close();
                }
            }
        } catch (error) {
            console.log("Error::", error);
        }
    };

    source.onerror = (error) => {
      console.error('Error:', error);
      source.close();
    };

    // Cleanup EventSource on unmount or before starting a new stream
    return () => {
      source.close();
    };
  };

  return (
    <div>
      <textarea value={userInput} onChange={handleInputChange} rows="4" cols="50" placeholder="Enter your input here..."></textarea>
      <br />
      <button onClick={startStream}>Start Streaming</button>
      <div id="streamingText" ref={streamingTextElement} style={{ overflow: 'scroll', marginTop: '20px', whiteSpace: 'pre-wrap' }}>
        {responseContent.substring(0, currentIndex)}
      </div>
    </div>
  );
}

export default StreamingComponent;
