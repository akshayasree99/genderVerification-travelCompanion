import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ChatWindow({ chatId, userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at');
      setMessages(data);
    };

    fetchMessages();

    const sub = supabase
      .channel('chat-room')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(sub);
  }, [chatId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    await supabase.from('messages').insert({
      chat_id: chatId,
      sender_id: userId,
      content: input,
    });

    setInput('');
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md">
      <div className="h-60 overflow-y-scroll mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded mb-2 ${
              msg.sender_id === userId ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'
            }`}
          >
            <div className="text-sm">{msg.content}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
