<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\RecordHostCombinations;
use App\Agents\Models\Host;
use App\Agents\Values\HostCombination;
use App\Contracts\CommandHandler;

final readonly class RecordHostCombinationsHandler implements CommandHandler
{
    public function handle(RecordHostCombinations $command): void
    {
        Host::query()->lockForUpdate()->findOrFail($command->hostId)->recordCombinations(
            $command->protocolVersion,
            array_map(fn (HostCombination $combination) => $combination->stored(), $command->combinations),
        );
    }
}
