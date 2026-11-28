<?php

declare(strict_types=1);

namespace App\Agents;

use App\Agents\Contracts\RunningTools as RunningToolsContract;
use App\Models\Agents\AgentRunningTool;
use App\Values\StackTarget;
use App\Values\ToolLine;

/**
 * Keeps each agent's running tool call in its one row, which raises a fact on every write that changes it.
 */
final readonly class RunningTools implements RunningToolsContract
{
    public function started(StackTarget $target, ToolLine $line): void
    {
        $tool = AgentRunningTool::findLockedFor($target->agentId);

        if ($tool === null) {
            AgentRunningTool::create($target->agentId, $line);

            return;
        }

        $tool->start($line);
    }

    public function finished(StackTarget $target): void
    {
        $tool = AgentRunningTool::findLockedFor($target->agentId);
        $tool?->finish();
    }

    public function cleared(StackTarget $target): void
    {
        $tool = AgentRunningTool::findLockedFor($target->agentId);
        $tool?->clear();
    }
}
