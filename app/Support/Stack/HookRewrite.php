<?php

declare(strict_types=1);

namespace App\Support\Stack;

use App\Contracts\Actors\AgentTexts;
use App\Contracts\Processes\ShellCommandParser;
use App\Exceptions\RepeatedCommandRewrite;
use App\Support\Inputs\ShellCommandRequested;

/**
 * Answers a shell command, and when a state rewrites it, walks the replacement once more on the stack the rewrite left.
 * A refused replacement leaves the stack as it was before the rewrite; a second rewrite is an error.
 */
final readonly class HookRewrite
{
    public function __construct(private ShellCommandParser $parser, private AgentTexts $texts) {}

    public function answer(AgentStack $stack, ShellCommandRequested $input): HookAnswer
    {
        $first = $stack->answer($input, $this->texts);

        if (! $first->isRewrite()) {
            return $first;
        }

        $line = $first->decision->replacementLine();
        $replacement = $input->replacedBy($this->parser->parse($line, $input->command->dialect));
        $second = $first->stack->answer($replacement, $this->texts);

        if ($second->isRewrite()) {
            throw RepeatedCommandRewrite::for($line, $second->decision->replacementLine());
        }

        if ($second->isAllowed()) {
            return $first->acceptedWith($second);
        }

        return $second->refusedOn($stack, $first);
    }
}
