<?php

declare(strict_types=1);

namespace App\Commands\WakeAgent;

use App\Contracts\CommandHandler;
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
