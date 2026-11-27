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
}
