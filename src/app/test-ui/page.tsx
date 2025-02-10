import React from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"

const TestUiPage = () => {

    const success = "This is a success message"

    return (
        <div>
            <Alert variant="default" className="mt-4 border border-green-500">
                <CheckCircle2 className="h-4 w-4" color='green' />
                <AlertTitle className='text-green-500'>Success</AlertTitle>
                <AlertDescription className='text-green-500'>{success}</AlertDescription>
            </Alert>
        </div>
    )
}

export default TestUiPage