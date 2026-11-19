<?php

declare(strict_types=1);

namespace Tests\Support\Skills;

use App\Agents\Models\AgentSession;
use App\Agents\Support\StackTarget;
use App\Hooks\Enums\ToolOutcome;
use App\Hooks\Events\ToolCallFinished;
use App\Hooks\Inputs\ProgramToolInput;
use App\Hooks\Inputs\ToolResult;
use App\Skills\Listeners\RecordProvenSkillReads;

/**
 * A tool call of the session that finished well, handed to the listener that records proven skill reads.
 */
trait FinishesToolCalls
{
    /**
     * @param  array<string, mixed>  $arguments
     */
    private function finished(AgentSession $session, string $tool, array $arguments): void
    {
        $this->app->make(RecordProvenSkillReads::class)->handle(new ToolCallFinished(
            new StackTarget($session->agent_id, $session->id),
            new ToolResult($tool, ToolOutcome::Succeeded, new ProgramToolInput($arguments)),
        ));
    }
}
