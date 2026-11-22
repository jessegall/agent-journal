<?php

declare(strict_types=1);

namespace App\Commands\ReassignAgentRuntime;

use App\Contracts\CommandFacts;
use App\Contracts\CommandHandler;
use App\Events\AgentRuntimeReassigned;
use App\Exceptions\DriverRequestRefused;
use App\Models\AgentSession;
use App\Support\ActorIdentity;
use App\Support\DriverRequests;
use App\Support\StartTokens;

final readonly class ReassignAgentRuntimeHandler implements CommandHandler
{
    public function __construct(
        private DriverRequests $requests,
        private StartTokens $credentials,
        private CommandFacts $facts,
    ) {}

    public function handle(ReassignAgentRuntimeCommand $command): int
    {
        $target = $command->target();
        $runtime = $this->requests->runtimeOf($target);

        if (! $runtime->isAtGeneration($command->expectedGeneration)) {
            throw DriverRequestRefused::generationChanged(
                $target,
                $command->expectedGeneration,
                $runtime->process_generation,
            );
        }

        if (! $runtime->canBeReassigned()) {
            throw DriverRequestRefused::notReassignable($target);
        }

        $fromHostId = $runtime->host_id;
        $token = $this->credentials->rotate(AgentSession::query()->findOrFail($target->sessionId));
        $runtime->reassignTo($command->hostId ?? $fromHostId, $token);

        $this->facts->publishAfterCommit(new AgentRuntimeReassigned(
            $runtime->id,
            $fromHostId,
            $runtime->host_id,
            $runtime->process_generation,
            ActorIdentity::of($command->dispatchedBy()),
            $command->proof,
            $command->reason,
        ));

        return $runtime->process_generation;
    }
}
