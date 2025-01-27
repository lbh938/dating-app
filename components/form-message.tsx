export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

interface FormMessageProps {
  message: Message | string;
  error?: boolean;
}

export function FormMessage({ message, error = false }: FormMessageProps) {
  const messageText = typeof message === 'string' 
    ? message 
    : 'error' in message 
      ? message.error
      : 'success' in message 
        ? message.success 
        : message.message;

  const isError = error || (typeof message !== 'string' && 'error' in message);

  return (
    <div className={`p-3 rounded-md ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
      {messageText}
    </div>
  );
}
