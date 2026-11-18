<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\WakeAgent;
use App\Agents\Enums\DriverOperation;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\DriverRequests;
use App\Contracts\CommandHandler;

final readonly class WakeAgentHandler implements CommandHandler
{
    public function __construct(private DriverRequests $requests) {}

    public function handle(WakeAgent $command): DriverReceipt
    {
        $open = $this->requests->openWake($command->target());

        if ($open !== null) {
            $open->claimWake(($open->wake_requested ?? 1) + 1);

            return $open->receipt();
        }

        $wake = $this->requests->append($command->target(), DriverOperation::Wake, $command->idempotencyKey, []);
        $wake->claimWake(1);

        return $wake->receipt();
    }
}
