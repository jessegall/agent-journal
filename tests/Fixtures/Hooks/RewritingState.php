<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Support\Decisions\Decision;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\States\AgentState;

/**
 * A test state that rewrites each line it knows to its replacement and passes on anything else.
 */
final class RewritingState extends AgentState
{
    public int $askedCount = 0;

    /**
     * @param  array<string, string>  $replacements  a line and the line to run instead
     */
    public function __construct(private readonly array $replacements) {}

    public function onShellCommand(ShellCommandRequested $input): Decision|null
    {
        $this->askedCount++;
        $replacement = $this->replacements[$input->command->source] ?? null;

        if ($replacement === null) {
            return null;
        }

        return Decision::rewrite($replacement);
    }
}
