<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\WakeAgent;
use App\Agents\Support\AgentWakes;
use App\Agents\Values\DriverReceipt;
use App\Contracts\CommandHandler;

final readonly class WakeAgentHandler implements CommandHandler
{
    public function __construct(private AgentWakes $wakes) {}

    public function handle(WakeAgent $command): DriverReceipt
    {
        return $this->wakes->wake($command->target(), $command->idempotencyKey);
    }
}
