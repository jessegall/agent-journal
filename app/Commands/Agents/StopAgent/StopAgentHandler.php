<?php

declare(strict_types=1);

namespace App\Commands\Agents\StopAgent;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Exceptions\StopOutdated;
use App\Support\DriverRequests;
use App\Support\TerminalControls;
use App\Values\DriverReceipt;

final readonly class StopAgentHandler implements CommandHandler
{
    public function __construct(
        private DriverRequests $requests,
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    /**
     * @throws StopOutdated
     */
    public function handle(StopAgentCommand $command): DriverReceipt
    {
        $target = $command->target();

        if ($command->expectedGeneration !== null) {
            $runtime = $this->requests->runtimeOf($target);

            if (! $runtime->isAtGeneration($command->expectedGeneration)) {
                throw StopOutdated::forSession(
                    $target->sessionId,
                    $command->expectedGeneration,
                    $runtime->process_generation,
                );
            }
        }

        $open = $this->requests->openStop($target);

        if ($open !== null) {
            return $open->receipt;
        }

        $this->controls->revokeRuntime($this->requests->runtimeOf($target)->load('session'), $this->clock->now());

        return $this->requests->stop($target, $command->idempotencyKey)->receipt;
    }
}
