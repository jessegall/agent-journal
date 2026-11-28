<?php

declare(strict_types=1);

namespace App\Bus;

use App\Bus\Contracts\CommittedListenerFailures;
use App\Bus\Exceptions\CommittedFactListenerFailed;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Psr\Log\LoggerInterface;

/**
 * Reports the failure of a listener on a committed fact and tells the operator through the log, as the write stands.
 */
final readonly class ReportedListenerFailures implements CommittedListenerFailures
{
    public function __construct(private ExceptionHandler $exceptions, private LoggerInterface $log) {}

    public function take(CommittedFactListenerFailed $failure): void
    {
        $this->exceptions->report($failure);
        $this->log->error('committed listener failed', ['failure' => $failure->getMessage()]);
    }
}
