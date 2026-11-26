<?php

declare(strict_types=1);

namespace Tests\Support\Console;

use App\Bus\OutsideCommandAllowance;
use Illuminate\Testing\PendingCommand;

/**
 * An artisan command a test runs, which refuses a write outside a bus command while it runs, as the running app does.
 */
final class PendingAppCommand extends PendingCommand
{
    public function run(): int
    {
        return $this->app->make(OutsideCommandAllowance::class)->forbidDuring(fn (): int => parent::run());
    }
}
