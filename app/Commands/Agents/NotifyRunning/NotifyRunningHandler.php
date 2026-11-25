<?php

declare(strict_types=1);

namespace App\Commands\Agents\NotifyRunning;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Enums\DriverType;
use App\Events\Sessions\SessionStateChanged;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverSwitch;
use App\Models\Starts\ProcessStart;
use App\Models\Starts\StartRecord;

final readonly class NotifyRunningHandler implements CommandHandler
{
    public function __construct(private CommandFacts $facts) {}

    public function handle(NotifyRunningCommand $command): void
    {
        $start = ProcessStart::claimedBy($command->hostId, $command->startKey);

        // Only this report moving the start to running confirms its switch and keeps its driver type; a delayed one after
        // the start ended or was superseded confirms nothing and leaves the agent's saved driver type as it was.
        if (! $start->recordRunning($command->executionId)) {
            return;
        }

        $this->facts->publishAfterCommit(new SessionStateChanged($start->session_id));
        DriverSwitch::startingOf($start->session_id)?->confirm();
        $saved = $this->keptDriverType($start->session_id);

        if ($saved !== null) {
            AgentSession::query()->withAgent()->findOrFail($start->session_id)->agent->preferDriverType($saved);
        }
    }

    /**
     * The driver type the start of this session asked to keep for its agent: its runtime's when it opened one, else its
     * start record's; none when it asked nothing.
     */
    private function keptDriverType(string $sessionId): DriverType|null
    {
        $runtime = AgentRuntime::ofSession($sessionId);

        if ($runtime !== null && $runtime->remember) {
            return $runtime->driver_type;
        }

        return StartRecord::savedDriverTypeOf($sessionId);
    }
}
