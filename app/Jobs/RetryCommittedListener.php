<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Bus\ListenerRetries;
use App\Bus\Values\ListenerRun;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\Middleware\WithoutOverlapping;

final class RetryCommittedListener implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly ListenerRun $run,
        public readonly int $retry,
        public readonly string|null $attemptId,
    ) {}

    public function handle(ListenerRetries $retries): void
    {
        $retries->run($this);
    }

    /**
     * @return list<WithoutOverlapping>
     */
    public function middleware(): array
    {
        return $this->attemptId === null ? [] : [new WithoutOverlapping($this->attemptId)->expireAfter(90)];
    }
}
