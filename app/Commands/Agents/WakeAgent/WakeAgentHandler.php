<?php

declare(strict_types=1);

namespace App\Commands\Agents\WakeAgent;

use App\Contracts\Bus\CommandHandler;
use App\Support\AgentWakes;
use App\Values\DriverReceipt;

final readonly class WakeAgentHandler implements CommandHandler
{
    public function __construct(private AgentWakes $wakes) {}

    public function handle(WakeAgentCommand $command): DriverReceipt
    {
        return $this->wakes->wake($command->target(), $command->idempotencyKey);
    }
}
