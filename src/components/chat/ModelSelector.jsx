import { AVAILABLE_MODELS } from '@/types/chat';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bot } from 'lucide-react';

export function ModelSelector({ value, onChange, excludeModel, label }) {
  const availableModels = excludeModel
    ? AVAILABLE_MODELS.filter(m => m.id !== excludeModel)
    : AVAILABLE_MODELS;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {label}
        </span>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full glass-panel border-border/50 hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent className="glass-panel border-border/50">
          {availableModels.map(model => (
            <SelectItem 
              key={model.id} 
              value={model.id}
              className="focus:bg-primary/10 focus:text-foreground"
            >
              <div className="flex flex-col">
                <span className="font-medium">{model.name}</span>
                <span className="text-xs text-muted-foreground">{model.provider}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
