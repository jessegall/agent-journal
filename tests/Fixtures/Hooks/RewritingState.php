<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Core\Hooks\Decisions\Decision;
use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\Inputs\ShellCommandRequested;
use App\Core\Hooks\States\AgentState;

/**
 * A test state that rewrites each line it knows to its replacement, may push a child with it, and delegates on anything else.
 */
final class RewritingState extends AgentState
{
    public int $askedCount = 0;

    /**
     * @param  array<string, string>  $replacements  a line and the line to run instead
     */
    public function __construct(
        private readonly array $replacements,
        private readonly StateReference|null $childToPush = null,
    ) {}

    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        $this->askedCount++;
        $replacement = $this->replacements[$input->command->source] ?? null;

        if ($replacement === null) {
            return Decision::delegate();
        }

        if ($this->childToPush === null) {
            return Decision::rewrite($replacement);
        }

        return Decision::rewrite($replacement)->withPush($this->childToPush);
    }
}
