<?php

declare(strict_types=1);

namespace App\Commands\Agents\CheckStartStatus;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Drivers\DriverOperation;
use App\Models\Agents\AgentRuntime;
use App\Support\DriverRequests;
use App\Values\DriverRequestPayload;

final readonly class CheckStartStatusHandler implements CommandHandler
{
    public function __construct(private DriverRequests $requests) {}

    /**
     * Answers whether the host was asked: a session with a runtime has a host to ask, which answers with its report,
     * and a check still open is the one answered, so a second ask adds no request.
     */
    public function handle(CheckStartStatusCommand $command): bool
    {
        if (! AgentRuntime::existsForSession($command->sessionId)) {
            return false;
        }

        $target = $command->target();

        if ($this->requests->openOf($target, DriverOperation::ResendReadiness) === null) {
            $this->requests->append(
                $target,
                DriverOperation::ResendReadiness,
                $command->idempotencyKey,
                DriverRequestPayload::nothing(),
            );
        }

        return true;
    }
}
