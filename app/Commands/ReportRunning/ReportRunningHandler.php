<?php

declare(strict_types=1);

namespace App\Commands\ReportRunning;

use App\Contracts\CommandHandler;
use App\Enums\DriverVariant;
use App\Models\AgentRuntime;
use App\Models\AgentSession;
use App\Models\DriverSwitch;
use App\Models\ProcessStart;
use App\Models\StartRecord;

final readonly class ReportRunningHandler implements CommandHandler
{
    public function handle(ReportRunningCommand $command): void
    {
        $start = ProcessStart::claimedBy($command->hostId, $command->startKey);

        // Only this report moving the start to running confirms its switch and keeps its mode; a delayed one after
        // the start ended or was superseded confirms nothing and leaves the agent's saved mode as it was.
        if (! $start->recordRunning($command->executionId)) {
            return;
        }

        DriverSwitch::startingOf($start->session_id)?->confirm();
        $saved = $this->variantToKeep($start->session_id);

        if ($saved !== null) {
            AgentSession::query()->with('agent')->findOrFail($start->session_id)->agent->preferVariant($saved);
        }
    }

    /**
     * The variant the start of this session asked to keep for its agent: its runtime's when it opened one, else its
     * start record's; none when it asked nothing.
     */
    private function variantToKeep(string $sessionId): DriverVariant|null
    {
        $runtime = AgentRuntime::ofSession($sessionId);

        if ($runtime !== null && $runtime->remember) {
            return $runtime->mode;
        }

        return StartRecord::savedVariantOf($sessionId);
    }
}
