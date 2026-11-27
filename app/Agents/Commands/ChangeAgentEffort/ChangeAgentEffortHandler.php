<?php

declare(strict_types=1);

namespace App\Agents\Commands\ChangeAgentEffort;

use App\Agents\DriverSettings;
use App\Bus\Contracts\CommandHandler;
use App\Values\DriverReceipt;

final readonly class ChangeAgentEffortHandler implements CommandHandler
{
    public function __construct(private DriverSettings $settings) {}

    public function handle(ChangeAgentEffortCommand $command): DriverReceipt
    {
        return $this->settings->acceptEffort($command->target(), $command->idempotencyKey, $command->effort)->receipt;
    }
}
