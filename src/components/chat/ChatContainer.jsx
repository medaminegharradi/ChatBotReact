import { useState, useCallback, useRef } from 'react';
import { useChatStore } from '@/hooks/useChatStore';
import { ModeSelector } from './ModeSelector';
import { DirectChatView } from './DirectChatView';
import { ComparisonChatView } from './ComparisonChatView';
import { ChatSidebar } from './ChatSidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Sparkles } from 'lucide-react';

const generateMockResponse = async (modelId, content) => {
  const responses = {
    'gpt-4': [
      "I understand your question. Let me provide a comprehensive analysis...",
      "Based on my training data, here's what I can tell you: ",
      "This is an interesting topic. The key points to consider are: ",
    ],
    'gpt-4.1': [
      "Great question! I'll break this down step by step...",
      "Looking at this from multiple angles, I can see that...",
      "Here's my detailed response to your query: ",
    ],
    'claude-3': [
      "I'd be happy to help with that. Here's my perspective...",
      "That's a thoughtful question. Let me explore it thoroughly...",
      "I'll provide a nuanced answer that considers various factors: ",
    ],
    'gemini-pro': [
      "Analyzing your request... Here's what I found interesting...",
      "Let me synthesize information from various sources...",
      "Based on my understanding, here's a comprehensive view: ",
    ],
    'mistral-large': [
      "Excellent question! Here's my take on this...",
      "I'll approach this systematically. First, let's consider...",
      "Allow me to provide a detailed explanation: ",
    ],
    'llama-3': [
      "Thanks for asking! Here's what I think about this...",
      "Let me share my insights on this topic...",
      "I'll give you a straightforward answer: ",
    ],
  };

  const modelResponses = responses[modelId] || responses['gpt-4'];
  const baseResponse = modelResponses[Math.floor(Math.random() * modelResponses.length)];
  const fullResponse = `${baseResponse}\n\nRegarding "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}", this is a simulated response demonstrating how ${modelId.toUpperCase()} would respond. In a real implementation, this would connect to the actual API and stream real responses.`;

  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

  return fullResponse;
};

export function ChatContainer() {
  const {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    deleteConversation,
    addMessage,
    addComparisonMessage,
    updateComparisonResponse,
    setMode,
    setSelectedModel,
    setComparisonModels,
  } = useChatStore();

  const [isLoading, setIsLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const conversationIdRef = useRef(null);

  const ensureConversation = useCallback(() => {
    if (!activeConversation) {
      const newId = createConversation('direct');
      conversationIdRef.current = newId;
      return newId;
    }
    conversationIdRef.current = activeConversationId;
    return activeConversationId;
  }, [activeConversation, activeConversationId, createConversation]);

  const handleModeChange = useCallback((mode) => {
    const conversationId = ensureConversation();
    setMode(conversationId, mode);
  }, [ensureConversation, setMode]);

  const handleDirectMessage = useCallback(async (content) => {
    const conversationId = ensureConversation();
    if (!conversationId) return;

    setIsLoading(true);

    addMessage(conversationId, { role: 'user', content });

    const modelId = activeConversation?.selectedModel || 'gpt-4';

    try {
      const response = await generateMockResponse(modelId, content);
      addMessage(conversationId, { 
        role: 'assistant', 
        content: response, 
        modelId 
      });
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsLoading(false);
    }
  }, [ensureConversation, addMessage, activeConversation?.selectedModel]);

  const handleComparisonMessage = useCallback(async (content) => {
    const conversationId = ensureConversation();
    if (!conversationId) return;

    setIsLoading(true);

    const leftModelId = activeConversation?.leftModel || 'gpt-4';
    const rightModelId = activeConversation?.rightModel || 'claude-3';

    const compMessage = addComparisonMessage(conversationId, content, null, null);

    try {
      const [leftContent, rightContent] = await Promise.all([
        generateMockResponse(leftModelId, content),
        generateMockResponse(rightModelId, content),
      ]);

      const leftResponse = {
        id: `left-${Date.now()}`,
        role: 'assistant',
        content: leftContent,
        modelId: leftModelId,
        timestamp: Date.now(),
      };

      const rightResponse = {
        id: `right-${Date.now()}`,
        role: 'assistant',
        content: rightContent,
        modelId: rightModelId,
        timestamp: Date.now(),
      };

      updateComparisonResponse(conversationId, compMessage.id, 'left', leftResponse);
      updateComparisonResponse(conversationId, compMessage.id, 'right', rightResponse);
    } catch (error) {
      console.error('Error generating comparison responses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [ensureConversation, activeConversation?.leftModel, activeConversation?.rightModel, addComparisonMessage, updateComparisonResponse]);

  const handleSendMessage = useCallback((content) => {
    if (activeConversation?.mode === 'comparison') {
      handleComparisonMessage(content);
    } else {
      handleDirectMessage(content);
    }
  }, [activeConversation?.mode, handleDirectMessage, handleComparisonMessage]);

  const currentMode = activeConversation?.mode || 'direct';

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ChatSidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={setActiveConversationId}
        onCreate={() => createConversation(currentMode)}
        onDelete={deleteConversation}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-6 py-4 border-b border-border/50 glass-panel">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center theme-transition">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">AI Arena</h1>
              <p className="text-xs text-muted-foreground">Compare & Chat with LLMs</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <ModeSelector
              mode={currentMode}
              onModeChange={handleModeChange}
            />
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 min-h-0">
          {currentMode === 'comparison' ? (
            <ComparisonChatView
              conversation={activeConversation || {
                id: '',
                title: 'New Chat',
                mode: 'comparison',
                messages: [],
                comparisonMessages: [],
                selectedModel: null,
                leftModel: 'gpt-4',
                rightModel: 'claude-3',
                createdAt: Date.now(),
                updatedAt: Date.now(),
              }}
              onSendMessage={handleSendMessage}
              onLeftModelChange={(modelId) => {
                const id = ensureConversation();
                setComparisonModels(id, modelId, activeConversation?.rightModel || 'claude-3');
              }}
              onRightModelChange={(modelId) => {
                const id = ensureConversation();
                setComparisonModels(id, activeConversation?.leftModel || 'gpt-4', modelId);
              }}
              isLoading={isLoading}
              streamingLeftId={null}
              streamingRightId={null}
            />
          ) : (
            <DirectChatView
              conversation={activeConversation || {
                id: '',
                title: 'New Chat',
                mode: 'direct',
                messages: [],
                comparisonMessages: [],
                selectedModel: 'gpt-4',
                leftModel: null,
                rightModel: null,
                createdAt: Date.now(),
                updatedAt: Date.now(),
              }}
              onSendMessage={handleSendMessage}
              onModelChange={(modelId) => {
                const id = ensureConversation();
                setSelectedModel(id, modelId);
              }}
              isLoading={isLoading}
              streamingMessageId={null}
            />
          )}
        </main>
      </div>
    </div>
  );
}
