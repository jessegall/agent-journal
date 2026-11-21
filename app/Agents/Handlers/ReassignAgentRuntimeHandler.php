<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\StartTokens;
use App\Agents\Commands\ReassignAgentRuntime;
use App\Agents\Events\AgentRuntimeReassigned;
use App\Agents\Exceptions\DriverRequestRefused;
use App\Agents\Models\AgentSession;
use App\Agents\Support\DriverRequests;
use App\Bus\Contracts\CommandFacts;
use App\Contracts\CommandHandler;

final readonly class ReassignAgentRuntimeHandler implements CommandHandler
{
    public function __construct(
        private DriverRequests $requests,
        private StartTokens $credentials,
        private CommandFacts $facts,
    ) {}

    public function handle(ReassignAgentRuntime $command): int
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
