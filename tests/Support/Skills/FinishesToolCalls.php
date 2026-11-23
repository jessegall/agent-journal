<?php

declare(strict_types=1);

namespace Tests\Support\Skills;

use App\Enums\ToolOutcome;
use App\Events\ToolCallFinished;
use App\Listeners\RecordProvenSkillReads;
use App\Models\Agents\AgentSession;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\Inputs\Values\ToolResult;
use App\Values\StackTarget;

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
            new ToolResult($tool, ToolOutcome::Succeeded, new DriverToolInput($arguments)),
        ));
    }
}
