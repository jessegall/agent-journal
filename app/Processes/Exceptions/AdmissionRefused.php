<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use App\AgentRequests\Contracts\CallRefusal;
use App\AgentRequests\Exceptions\CallRefused;
use App\Processes\Calls\AdmissionRefusalDetails;

/**
 * The journal refused the line at admission: nothing started. It prints why, the correction and, for a line held for
 * review, the request and what comes next.
 */
final class AdmissionRefused extends CallRefused implements CallRefusal
{
    public const string CODE = 'admission_refused';

    public static function code(): string
    {
        return self::CODE;
    }

    /**
     * @return list<string>
     */
    public function consoleLines(): array
    {
        $details = AdmissionRefusalDetails::from($this->details);
        $lines = [
            "{$details->reasonCode}: {$details->reason} {$details->notice}",
            "Correction: {$details->correction}",
        ];

        if ($details->requestId !== '') {
            $lines[] = "Request {$details->requestId}. Next: {$details->next}";
        }

        return $lines;
    }
}
