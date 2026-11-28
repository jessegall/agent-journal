<?php

declare(strict_types=1);

namespace App\Agents\Commands\ReassignAgentRuntime;

use App\Agents\DriverRequestLedger;
use App\Bus\Contracts\CommandFacts;
use App\Bus\Contracts\CommandHandler;
use App\Events\Sessions\AgentRuntimeReassigned;
use App\Exceptions\DriverRequestRefused;
use App\Models\Agents\AgentSession;
use App\Sessions\SessionTokens;

final readonly class ReassignAgentRuntimeHandler implements CommandHandler
{
    public function __construct(
        private DriverRequestLedger $requests,
        private SessionTokens $credentials,
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
        $agentSession = AgentSession::query()->findOrFail($target->sessionId);

        $token = $this->credentials->rotate($agentSession);
        $runtime->reassignTo($command->hostId ?? $fromHostId, $token);

        $this->facts->publishAfterCommit(new AgentRuntimeReassigned(
            $runtime->id,
            $fromHostId,
            $runtime->host_id,
            $runtime->process_generation,
            $command->dispatchedBy(),
            $command->proof,
            $command->reason,
        ));

        return $runtime->process_generation;
    }
}
