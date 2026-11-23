<?php

declare(strict_types=1);

namespace App\Commands\CheckStartStatus;

use App\Contracts\Bus\CommandHandler;
use App\Enums\DriverOperation;
use App\Models\Agents\AgentRuntime;
use App\Models\Starts\StartRecord;
use App\Support\DriverRequests;
use App\Values\DriverRequestPayload;

final readonly class CheckStartStatusHandler implements CommandHandler
{
    public function __construct(private DriverRequests $requests) {}

    /**
     * Answers whether the host was asked: only an unverified start of a session with a runtime has something to check,
     * and a check still open is the one answered, so a second ask adds no request.
     */
    public function handle(CheckStartStatusCommand $command): bool
    {
        $unverified = StartRecord::lockedLatestOf($command->sessionId)
            ->filter(fn (StartRecord $start) => $start->readiness->isUnverified());

        if ($unverified->isEmpty() || ! AgentRuntime::existsForSession($command->sessionId)) {
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
