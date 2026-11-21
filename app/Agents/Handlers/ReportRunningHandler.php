<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ReportRunning;
use App\Agents\Enums\DriverVariant;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;
use App\Agents\Models\ProcessStart;
use App\Agents\Models\StartRecord;
use App\Contracts\CommandHandler;

final readonly class ReportRunningHandler implements CommandHandler
{
    public function handle(ReportRunning $command): void
    {
        $start = ProcessStart::claimedBy($command->hostId, $command->startKey);
        $start->recordRunning($command->executionId);
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

        if ($runtime !== null && $runtime->saves_variant) {
            return $runtime->variant;
        }

        return StartRecord::savedVariantOf($sessionId);
    }
}
