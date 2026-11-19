<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ChangeAgentModel;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\DriverSettings;
use App\Contracts\CommandHandler;

final readonly class ChangeAgentModelHandler implements CommandHandler
{
    public function __construct(private DriverSettings $settings) {}

    public function handle(ChangeAgentModel $command): DriverReceipt
    {
        return $this->settings->accept(
            $command->target(),
            $command->idempotencyKey,
            $command->model,
            null,
        )[0]->receipt();
    }
}
