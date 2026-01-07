import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'arena-chat-conversations';

const generateId = () => Math.random().toString(36).substring(2, 15);

const generateTitle = (content) => {
  const words = content.split(' ').slice(0, 5).join(' ');
  return words.length > 30 ? words.substring(0, 30) + '...' : words || 'New Chat';
};

export function useChatStore() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConversations(parsed);
        if (parsed.length > 0) {
          setActiveConversationId(parsed[0].id);
        }
      } catch (e) {
        console.error('Failed to parse stored conversations', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

  const createConversation = useCallback((mode = 'direct') => {
    const newConversation = {
      id: generateId(),
      title: 'New Chat',
      mode,
      messages: [],
      comparisonMessages: [],
      selectedModel: 'gpt-4',
      leftModel: 'gpt-4',
      rightModel: 'claude-3',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    return newConversation.id;
  }, []);

  const updateConversation = useCallback((id, updates) => {
    setConversations(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, ...updates, updatedAt: Date.now() }
          : c
      )
    );
  }, []);

  const deleteConversation = useCallback((id) => {
    setConversations(prev => {
      const filtered = prev.filter(c => c.id !== id);
      if (activeConversationId === id && filtered.length > 0) {
        setActiveConversationId(filtered[0].id);
      } else if (filtered.length === 0) {
        setActiveConversationId(null);
      }
      return filtered;
    });
  }, [activeConversationId]);

  const addMessage = useCallback((conversationId, message) => {
    const newMessage = {
      ...message,
      id: generateId(),
      timestamp: Date.now(),
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id !== conversationId) return c;
        
        const updatedMessages = [...c.messages, newMessage];
        const title = c.title === 'New Chat' && message.role === 'user'
          ? generateTitle(message.content)
          : c.title;

        return {
          ...c,
          messages: updatedMessages,
          title,
          updatedAt: Date.now(),
        };
      })
    );

    return newMessage;
  }, []);

  const addComparisonMessage = useCallback((
    conversationId,
    userMessage,
    leftResponse,
    rightResponse
  ) => {
    const newComparisonMessage = {
      id: generateId(),
      userMessage,
      leftResponse,
      rightResponse,
      timestamp: Date.now(),
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id !== conversationId) return c;
        
        const title = c.title === 'New Chat'
          ? generateTitle(userMessage)
          : c.title;

        return {
          ...c,
          comparisonMessages: [...c.comparisonMessages, newComparisonMessage],
          title,
          updatedAt: Date.now(),
        };
      })
    );

    return newComparisonMessage;
  }, []);

  const updateComparisonResponse = useCallback((
    conversationId,
    messageId,
    side,
    response
  ) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id !== conversationId) return c;
        
        return {
          ...c,
          comparisonMessages: c.comparisonMessages.map(cm => {
            if (cm.id !== messageId) return cm;
            return {
              ...cm,
              [side === 'left' ? 'leftResponse' : 'rightResponse']: response,
            };
          }),
          updatedAt: Date.now(),
        };
      })
    );
  }, []);

  const setMode = useCallback((conversationId, mode) => {
    updateConversation(conversationId, { mode });
  }, [updateConversation]);

  const setSelectedModel = useCallback((conversationId, modelId) => {
    updateConversation(conversationId, { selectedModel: modelId });
  }, [updateConversation]);

  const setComparisonModels = useCallback((conversationId, leftModel, rightModel) => {
    updateConversation(conversationId, { leftModel, rightModel });
  }, [updateConversation]);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    updateConversation,
    deleteConversation,
    addMessage,
    addComparisonMessage,
    updateComparisonResponse,
    setMode,
    setSelectedModel,
    setComparisonModels,
  };
}
