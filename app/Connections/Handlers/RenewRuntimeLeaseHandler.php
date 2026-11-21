<?php

declare(strict_types=1);

namespace App\Connections\Handlers;

use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;
use App\Connections\Commands\RenewRuntimeLease;
use App\Connections\Exceptions\LeaseRefused;
use App\Connections\Models\ProjectBinding;
use App\Connections\Values\RuntimeLease;
use App\Contracts\CommandHandler;
use Carbon\CarbonImmutable;

/**
 * Checks the binding, its authority generation, the runtime and its start grant, and that its session still runs
 * for the binding's main agent or a child of it, on every renewal, and answers the lease by server time; a presence
 * report never renews it.
 */
final readonly class RenewRuntimeLeaseHandler implements CommandHandler
{
    public function handle(RenewRuntimeLease $command): RuntimeLease
    {
        $binding = ProjectBinding::lockById($command->bindingId);

        if (! $binding->isReportableBy($command->hostId)) {
            throw LeaseRefused::for($command->runtimeId, 'the binding is not this host\'s or is revoked');
        }

        if ($command->authorityGeneration !== $binding->authority_generation) {
            throw LeaseRefused::for($command->runtimeId, 'the binding\'s authority generation changed');
        }

        $runtime = AgentRuntime::query()->whereKey($command->runtimeId)->first();

        if (! $runtime instanceof AgentRuntime
            || $runtime->host_id !== $command->hostId
            || $runtime->process_generation !== $command->runtimeGeneration
            || $runtime->canonical_folder !== $binding->canonical_root) {
            throw LeaseRefused::for($command->runtimeId, 'the runtime is not this binding\'s in its generation');
        }

        if ($runtime->start_grant === null
            || ! AgentSession::isRunningFor($runtime->agent_session_id, $binding->main_agent_id)) {
            throw LeaseRefused::for($command->runtimeId, 'the runtime holds no live grant of the binding\'s agents');
        }

        $now = CarbonImmutable::now();
        $expiresAt = $now->addSeconds(RuntimeLease::SECONDS);
        $binding->holdLease($runtime->id, $expiresAt);

        return new RuntimeLease(
            $runtime->id,
            $runtime->process_generation,
            $now->toIso8601String(),
            $expiresAt->toIso8601String(),
        );
    }
}
