<?php

declare(strict_types=1);

namespace App\Stacks\Concerns;

use App\Hooks\ToolBudgetDecider;
use App\Support\Decisions\Decision;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\ToolRequested;
use App\Values\AgentText;

/**
 * The hooks of a state that lets the agent work until its tool budget runs out: a read-only call always passes, any
 * other call is refused with the state's words once the agent must act now.
 */
trait ToolBudgetDecisions
{
    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        return ToolBudgetDecider::answer(! $input->isReadOnly() && $this->mustActNow(), $this->actNowText(...));
    }

    public function onToolRequested(ToolRequested $input): Decision
    {
        return ToolBudgetDecider::answer(! $input->isReadOnly() && $this->mustActNow(), $this->actNowText(...));
    }

    public function onFileEdit(FileEditRequested $input): Decision
    {
        return ToolBudgetDecider::answer($this->mustActNow(), $this->actNowText(...));
    }

    /**
     * Whether the budget ran out, so the agent must do what the state waits for before anything else.
     */
    abstract private function mustActNow(): bool;

    /**
     * The words that tell the agent to act now.
     */
    abstract private function actNowText(): AgentText;
}
