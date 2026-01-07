import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, MessageSquare, Columns2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onCreate,
  onDelete,
  isCollapsed,
  onToggle,
}) {
  return (
    <div className={cn(
      'flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300',
      isCollapsed ? 'w-14' : 'w-64'
    )}>
      <div className="flex items-center justify-between p-3 border-b border-sidebar-border">
        {!isCollapsed && (
          <span className="text-sm font-semibold text-sidebar-foreground">History</span>
        )}
        <div className="flex items-center gap-1">
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onCreate}
              className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {isCollapsed && (
        <div className="p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCreate}
            className="w-full h-10 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {conversations.map(conversation => (
            <div
              key={conversation.id}
              className={cn(
                'group relative rounded-lg transition-colors cursor-pointer',
                activeId === conversation.id
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
              )}
              onClick={() => onSelect(conversation.id)}
            >
              {isCollapsed ? (
                <div className="flex items-center justify-center p-2.5">
                  {conversation.mode === 'comparison' ? (
                    <Columns2 className="h-4 w-4" />
                  ) : (
                    <MessageSquare className="h-4 w-4" />
                  )}
                </div>
              ) : (
                <div className="flex items-start gap-2 p-2.5">
                  <div className="flex-shrink-0 mt-0.5">
                    {conversation.mode === 'comparison' ? (
                      <Columns2 className="h-4 w-4 text-primary" />
                    ) : (
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {conversation.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(conversation.updatedAt, { addSuffix: true })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conversation.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}

          {conversations.length === 0 && !isCollapsed && (
            <div className="text-center py-8 px-4">
              <p className="text-sm text-muted-foreground">
                No conversations yet
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={onCreate}
                className="mt-3 border-sidebar-border hover:bg-sidebar-accent"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
