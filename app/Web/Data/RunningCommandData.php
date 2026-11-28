<?php

declare(strict_types=1);

namespace App\Web\Data;

use App\Events\Hooks\RunningToolChanged;
use App\Models\Agents\AgentRunningTool;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The latest tool call an agent displays, with its line, running status and change time.
 * Initial reads and pushed updates use the same shape.
 */
#[TypeScript]
final class RunningCommandData extends Data
{
    public function __construct(
        public readonly string $agentId,
        public readonly string|null $line,
        public readonly bool $isRunning,
        public readonly string $changedAt,
    ) {}

    public static function fromAgentRunningTool(AgentRunningTool $tool): self
    {
        return new self($tool->agent_id, $tool->line, $tool->is_running, $tool->changed_at_text);
    }

    public static function fromRunningToolChanged(RunningToolChanged $change): self
    {
        return new self($change->agentId, $change->line, $change->isRunning, $change->changedAt);
    }
}
