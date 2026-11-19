<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ChangeAgentEffort;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\DriverSettings;
use App\Contracts\CommandHandler;

final readonly class ChangeAgentEffortHandler implements CommandHandler
{
    public function __construct(private DriverSettings $settings) {}

    public function handle(ChangeAgentEffort $command): DriverReceipt
    {
        return $this->settings->accept(
            $command->target(),
            $command->idempotencyKey,
            null,
            $command->effort,
        )[0]->receipt();
    }
}
