<?php

declare(strict_types=1);

namespace App\Pipes\Answer;

use App\Contracts\Bus\Pipe;
use App\Support\Admission\HookShellAdmission;
use App\Support\CallStages\RestoredCall;
use App\Support\CallStages\WalkedCall;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Stack\HookAnswer;
use App\Support\Stack\HookRewrite;
use Illuminate\Container\Container;

/**
 * Walks the restored stack and settles what the driver accepts. A shell line walks with its rewrite, and whatever
 * the frames answered, Core's mandatory admission then decides whether it runs. The rewrite and the admission hold
 * request state, and a pipe is built once and outlives the request under a long-lived server, so both are asked of
 * the container of the request in hand at each call, never of one this pipe kept.
 */
final readonly class WalkStack implements Pipe
{
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
            return $capabilities->finalAnswer($stack->answer($input), $stack);
        }

        $rewritten = Container::getInstance()->make(HookRewrite::class)->answer($stack, $input);
        $answer = $capabilities->finalAnswer($rewritten, $stack);

        return Container::getInstance()->make(HookShellAdmission::class)->admit($input, $answer, $stack, $capabilities);
    }
}
