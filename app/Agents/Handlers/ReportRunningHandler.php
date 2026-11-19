<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ReportRunning;
use App\Agents\Models\ProcessStart;
use App\Contracts\CommandHandler;

final readonly class ReportRunningHandler implements CommandHandler
{
    public function handle(ReportRunning $command): void
    {
        ProcessStart::claimedBy($command->hostId, $command->startKey)->recordRunning($command->executionId);
    }
}
