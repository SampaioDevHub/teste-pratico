import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ErrorProps {
  message?: string
  onRetry?: () => void
}

export function Error({ message = "Algo deu errado", onRetry }: ErrorProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex items-center gap-4">
        {message}
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="ml-auto">
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

