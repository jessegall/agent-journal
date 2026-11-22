<?php

declare(strict_types=1);

namespace App\Commands\ChangeAgentEffort;

use App\Contracts\Bus\CommandHandler;
use App\Support\DriverSettings;
use App\Values\DriverReceipt;

final readonly class ChangeAgentEffortHandler implements CommandHandler
{
    public function __construct(private DriverSettings $settings) {}

    public function handle(ChangeAgentEffortCommand $command): DriverReceipt
    {
        return $this->settings->accept(
            $command->target(),
            $command->idempotencyKey,
            null,
            $command->effort,
        )[0]->receipt();
    }
}
