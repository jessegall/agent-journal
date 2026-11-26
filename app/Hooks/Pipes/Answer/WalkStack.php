<?php

declare(strict_types=1);

namespace App\Hooks\Pipes\Answer;

use App\Access\HookShellAdmission;
use App\Actors\Contracts\AgentTexts;
use App\Bus\Contracts\Pipe;
use App\Hooks\CallStages\RestoredCall;
use App\Hooks\CallStages\WalkedCall;
use App\Stacks\HookAnswer;
use App\Stacks\HookRewrite;
use App\Support\Inputs\ShellCommandRequested;

/**
 * Walks the restored stack and settles what the driver accepts. A shell line walks with its rewrite, and whatever
 * the frames answered, Core's mandatory admission then decides whether it runs.
 */
final readonly class WalkStack implements Pipe
{
    public function __construct(
        private HookRewrite $rewrite,
        private HookShellAdmission $admission,
        private AgentTexts $texts,
    ) {}

    public function handle(RestoredCall $restored): WalkedCall
    {
        return $restored->walked($this->answerOf($restored));
    }

    private function answerOf(RestoredCall $restored): HookAnswer
    {
        $input = $restored->call->input;
        $capabilities = $restored->call->capabilities;
        $stack = $restored->stackBefore;

        if (! $input instanceof ShellCommandRequested) {
            return $capabilities->finalAnswer($stack->answer($input, $this->texts), $stack);
        }

        $rewritten = $this->rewrite->answer($stack, $input);
        $answer = $capabilities->finalAnswer($rewritten, $stack);

        return $this->admission->admit($input, $answer, $stack, $capabilities);
    }
}
