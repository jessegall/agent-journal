<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\StopAgent;
use App\Agents\Exceptions\StopOutdated;
use App\Agents\Support\DriverRequests;
use App\Agents\Values\DriverReceipt;
use App\Contracts\CommandHandler;

final readonly class StopAgentHandler implements CommandHandler
{
    public function __construct(private DriverRequests $requests) {}

    /**
     * @throws StopOutdated
     */
    public function handle(StopAgent $command): DriverReceipt
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
            return $open->receipt();
        }

        return $this->requests->stop($target, $command->idempotencyKey)->receipt();
    }
}
