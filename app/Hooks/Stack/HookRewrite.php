<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Hooks\Contracts\ShellCommandParser;
use App\Hooks\Exceptions\RepeatedCommandRewrite;
use App\Hooks\Inputs\ShellCommandRequested;

/**
 * Answers a shell command, and when a state rewrites it, walks the replacement once more on the stack the rewrite left.
 * A refused replacement leaves the stack as it was before the rewrite; a second rewrite is an error.
 */
final readonly class HookRewrite
{
    public function __construct(private ShellCommandParser $parser) {}

    public function answer(AgentStack $stack, ShellCommandRequested $input): HookAnswer
    {
        $first = $stack->answer($input);

        if (! $first->isRewrite()) {
            return $first;
        }

        $replacement = $input->replacedBy($this->parser->parse($first->decision->replacementLine(), $input->command->dialect));
        $second = $first->stack->answer($replacement);

        if ($second->isRewrite()) {
            throw RepeatedCommandRewrite::for($first->decision->replacementLine(), $second->decision->replacementLine());
        }

        if ($second->isAllowed()) {
            return $first->acceptedWith($second);
        }

        return $second->refusedOn($stack, $first);
    }
}
