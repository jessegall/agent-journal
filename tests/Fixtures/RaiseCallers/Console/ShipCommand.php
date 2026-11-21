<?php

declare(strict_types=1);

namespace Tests\Fixtures\RaiseCallers\Console;

use Illuminate\Console\Command;
use Tests\Fixtures\RaiseCallers\Models\Shipment;

/**
 * A console command that runs the transition with no command unit around it.
 */
final class ShipCommand extends Command
{
    protected $signature = 'fixture:ship';

    public function handle(): int
    {
        Shipment::query()->firstOrFail()->ship();

        return self::SUCCESS;
    }
}
