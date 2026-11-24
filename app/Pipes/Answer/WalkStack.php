<?php

declare(strict_types=1);

namespace App\Pipes\Answer;

use App\Contracts\Actors\AgentTexts;
use App\Contracts\Bus\Pipe;
use App\Support\Admission\HookShellAdmission;
use App\Support\CallStages\RestoredCall;
use App\Support\CallStages\WalkedCall;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Stack\HookAnswer;
use App\Support\Stack\HookRewrite;

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
