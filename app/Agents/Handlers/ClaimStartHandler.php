<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ClaimStart;
use App\Agents\Enums\ProcessStartState;
use App\Agents\Events\AccountSettingsRequested;
use App\Agents\Exceptions\StartClaimRefused;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;
use App\Agents\Models\ProcessStart;
use App\Agents\Models\StartRecord;
use App\Agents\Support\AccountStartSettings;
use App\Agents\Support\ClaimedStart;
use App\Contracts\CommandHandler;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Hands the host a pending start of a runtime assigned to it, with the recipe the program's adapter checked; another
 * host's start is refused, and when the adapter refuses the program's build or arrangement, the claim rolls back and
 * the start stays pending.
 */
final readonly class ClaimStartHandler implements CommandHandler
{
    public function __construct(private Dispatcher $events) {}

    /**
     * @throws StartClaimRefused
     */
    public function handle(ClaimStart $command): ClaimedStart|null
    {
        $runtime = AgentRuntime::ofSession($command->sessionId)
            ?? throw StartClaimRefused::withoutRuntime($command->sessionId);

        if (! $runtime->isAssignedTo($command->hostId)) {
            throw StartClaimRefused::onAnotherHost($command->sessionId, $command->hostId);
        }

        $start = $this->claimFor($command->hostId, $command->sessionId);

        if ($start === null) {
            return null;
        }

        $program = AgentSession::query()->findOrFail($start->session_id)->selection()->program->value;
        $settings = new AccountStartSettings();
        $requested = new AccountSettingsRequested($program, $start->accountIdentity(), $start->directory, $settings);
        $this->events->dispatch($requested);

        return new ClaimedStart(
            $start->start_key,
            $start->session_id,
            $start->directory,
            $start->account_generation,
            $settings->recipeFor($program, $start->transport_profile),
            StartRecord::conversationTargetOf($start->session_id),
        );
    }

    /**
     * The pending start of the session, taken by the host that will make its process; none when it was cancelled or
     * taken already. A start whose session ended is cancelled instead, so no process starts for it.
     */
    private function claimFor(string $hostId, string $sessionId): ProcessStart|null
    {
        $start = ProcessStart::supervised()
            ->where('session_id', $sessionId)
            ->where('state', ProcessStartState::Pending->value)
            ->lockForUpdate()
            ->first();

        if ($start === null) {
            return null;
        }

        if (! AgentSession::query()->findOrFail($sessionId)->isActive()) {
            $start->cancelPending();

            return null;
        }

        $start->claimOn($hostId);

        return $start;
    }
}
