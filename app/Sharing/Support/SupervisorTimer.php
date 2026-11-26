<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use Closure;

/**
 * One of the sharing supervisor's timers: work it runs every so many seconds, first at once.
 */
final class SupervisorTimer
{
    private int $dueAt = 0;

    /**
     * @param  Closure(): void  $work
     */
    public function __construct(
        private readonly int $intervalSeconds,
        private readonly Closure $work,
    ) {}

    /**
     * Runs the work when its time came, and sets when it runs next.
     */
    public function runIfDue(int $now): void
    {
        if ($now < $this->dueAt) {
            return;
        }

        ($this->work)();
        $this->dueAt = $now + $this->intervalSeconds;
    }
}
