<?php

declare(strict_types=1);

namespace App\Support\Octane;

use Illuminate\Container\Attributes\Config;

/**
 * Gives each request the whole time limit from its own start: a FrankenPHP worker sets the limit once when it starts,
 * so its clock runs across the requests it serves and a long poll late in its life is stopped early.
 */
final readonly class GiveRequestItsTimeLimit
{
    public function __construct(#[Config('octane.max_execution_time')]
        private int $seconds) {}

    public function handle(): void
    {
        set_time_limit($this->seconds);
    }

    /**
     * Gives a request that is about to wait the wait on top of the whole time limit, from now: a long poll that waits
     * near the limit would otherwise be stopped while it answers.
     */
    public function lendWait(int $waitSeconds): void
    {
        set_time_limit($waitSeconds + $this->seconds);
    }
}
