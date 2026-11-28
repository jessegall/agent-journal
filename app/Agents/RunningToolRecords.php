<?php

declare(strict_types=1);

namespace App\Agents;

use App\Agents\Contracts\RunningTools;
use App\Models\Agents\AgentRunningTool;
use App\Values\StackTarget;
use App\Values\ToolLine;

/**
 * Keeps each agent's running tool call in its one row, which raises a fact on every write that changes it.
 */
final readonly class RunningToolRecords implements RunningTools
{
    public function started(StackTarget $target, ToolLine $line): void
    {
        AgentRunningTool::findOrPrepareLockedFor($target->agentId)->start($line);
    }

    public function finished(StackTarget $target): void
    {
        AgentRunningTool::findOrPrepareLockedFor($target->agentId)->finish();
    }

    public function cleared(StackTarget $target): void
    {
        AgentRunningTool::findOrPrepareLockedFor($target->agentId)->clear();
    }
}
