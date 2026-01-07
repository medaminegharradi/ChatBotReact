import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageSquare, Columns2 } from 'lucide-react';

export function ModeSelector({ mode, onModeChange }) {
  return (
    <Select value={mode} onValueChange={(value) => onModeChange(value)}>
      <SelectTrigger className="w-[200px] glass-panel border-border/50 hover:border-primary/50 transition-colors">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="glass-panel border-border/50">
        <SelectItem value="direct" className="focus:bg-primary/10 focus:text-foreground">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            <span>Direct Chat</span>
          </div>
        </SelectItem>
        <SelectItem value="comparison" className="focus:bg-primary/10 focus:text-foreground">
          <div className="flex items-center gap-2">
            <Columns2 className="h-4 w-4 text-primary" />
            <span>Side-by-Side</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
