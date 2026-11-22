<?php

declare(strict_types=1);

namespace App\Pipes\Answer;

use App\Contracts\Pipe;
use App\Support\Admission\HookShellAdmission;
use App\Support\CallStages\RestoredCall;
use App\Support\CallStages\WalkedCall;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Stack\HookAnswer;
use App\Support\Stack\HookRewrite;
use Illuminate\Contracts\Container\Container;

/**
 * Walks the restored stack and settles what the driver accepts. A shell line walks with its rewrite, and whatever
 * the frames answered, Core's mandatory admission then decides whether it runs. The rewrite and the admission hold
 * request state, so both are asked for per call.
 */
final readonly class WalkStack implements Pipe
{
    public function __construct(private Container $container) {}

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

        $rewritten = $this->container->make(HookRewrite::class)->answer($stack, $input);
        $answer = $capabilities->finalAnswer($rewritten, $stack);

        return $this->container->make(HookShellAdmission::class)->admit($input, $answer, $stack, $capabilities);
    }
}
