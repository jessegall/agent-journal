<?php

declare(strict_types=1);

namespace App\Agents\Commands\ChangeAgentModel;

use App\Agents\DriverSettings;
use App\Bus\Contracts\CommandHandler;
use App\Values\DriverReceipt;

final readonly class ChangeAgentModelHandler implements CommandHandler
{
    public function __construct(private DriverSettings $settings) {}

    public function handle(ChangeAgentModelCommand $command): DriverReceipt
    {
        return $this->settings->accept(
            $command->target(),
            $command->idempotencyKey,
            $command->model,
            null,
        )[0]->receipt;
    }
}
