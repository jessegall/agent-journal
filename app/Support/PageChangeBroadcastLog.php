<?php

declare(strict_types=1);

namespace App\Support;

use App\Events\Web\PageChanged;
use Carbon\CarbonImmutable;
use Illuminate\Queue\Events\JobProcessing;
use Psr\Log\LoggerInterface;

/**
 * Logs each queued page change as the queue starts broadcasting it, with how long it waited since it was queued, so
 * a broadcast delay can be told apart from the browser's own reading time.
 */
final readonly class PageChangeBroadcastLog
{
    public function __construct(private LoggerInterface $log) {}

    public function record(JobProcessing $processing): void
    {
        if ($processing->job->resolveName() !== PageChanged::class) {
            return;
        }

        $queuedAt = (int) $processing->job->payload()['createdAt'];

        $this->log->info('A page change is being broadcast.', [
            'job' => $processing->job->uuid(),
            'queue' => $processing->job->getQueue(),
            'waited_seconds' => max(0, CarbonImmutable::now()->getTimestamp() - $queuedAt),
        ]);
    }
}
