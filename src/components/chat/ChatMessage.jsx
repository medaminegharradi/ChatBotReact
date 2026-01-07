import { AVAILABLE_MODELS } from '@/types/chat';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ChatMessage({ message, isStreaming }) {
  const isUser = message.role === 'user';
  const model = message.modelId 
    ? AVAILABLE_MODELS.find(m => m.id === message.modelId)
    : null;

  return (
    <div className={cn(
      'flex gap-3 animate-slide-up',
      isUser ? 'flex-row-reverse' : 'flex-row'
    )}>
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
        isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary border border-border'
      )}>
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4 text-primary" />
        )}
      </div>

      <div className={cn(
        'flex-1 max-w-[80%] rounded-lg px-4 py-3',
        isUser ? 'message-bubble-user' : 'message-bubble-assistant'
      )}>
        {!isUser && model && (
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
            <span className="text-xs font-medium text-primary">{model.name}</span>
            <span className="text-xs text-muted-foreground">• {model.provider}</span>
          </div>
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-primary/80 ml-1 animate-pulse" />
          )}
        </p>
      </div>
    </div>
  );
}
