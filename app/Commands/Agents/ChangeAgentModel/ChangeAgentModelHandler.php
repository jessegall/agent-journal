<?php

declare(strict_types=1);

namespace App\Commands\Agents\ChangeAgentModel;

use App\Contracts\Bus\CommandHandler;
use App\Support\DriverSettings;
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
