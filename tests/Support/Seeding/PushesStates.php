<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Agents\Drivers\Capabilities\DriverCapabilities;
use App\Agents\Drivers\Enums\RewriteSupport;
use App\Contracts\Work\StackTransaction;
use App\Models\Agents\AgentSession;
use App\Stacks\AgentStacks;
use App\Stacks\Frames\Frame;
use App\Stacks\HookAnswer;
use App\Stacks\References\StateReference;
use App\Support\Inputs\Contracts\HookInput;
use App\Values\StackTarget;
use Closure;
use PHPUnit\Framework\Assert;

/**
 * A state of a test on the real stack of an agent's session: pushed through the stack machinery inside the real
 * transaction under the agent's authority, or followed where a command already put it, bound to its one frame and
 * handed to the test's scope.
 */
trait PushesStates
{
    /**
     * Pushes the state onto the stack of the agent of this name, or of the session or target given, as the stack
     * machinery pushes it; stateOn() then reaches the frame the push left, a new one or the one it reused.
     */
    public function pushState(string|AgentSession|StackTarget $on, StateReference $reference): self
    {
        $target = $this->stackTargetOf($on);

        $this->requests->during(
            fn () => $this->requests->asAgent($target->agentId, $target->sessionId),
            fn () => $this->app->make(StackTransaction::class)->run(
                fn () => $this->app->make(AgentStacks::class)->push($target, $reference),
            ),
        );

        return $this;
    }

    /**
     * The one frame of the state on the stack, pushed by the test or by a command, such as the work state a started
     * task pushes, handed to the scope bound to that frame.
     *
     * @param  Closure(StateHandle): mixed  $scope
     */
    public function stateOn(string|AgentSession|StackTarget $on, StateReference $reference, Closure $scope): self
    {
        $scope($this->stateHandle(new StateStack($this->app, $this->stackTargetOf($on)), $reference));

        return $this;
    }

    /**
     * The session's stack holds no frame of the reference, live or finished.
     */
    public function assertNoFrame(string|AgentSession|StackTarget $on, StateReference $reference): self
    {
        $frames = array_filter(
            new StateStack($this->app, $this->stackTargetOf($on))->stack()->frames(),
            fn (Frame $frame) => $frame->isFor($reference),
        );

        Assert::assertSame([], array_values($frames), "The stack holds a {$reference->typeKey} frame.");

        return $this;
    }

    /**
     * Sends one hook through the session's state machine as its agent and returns the answer its stack gave.
     */
    public function answerHook(
        string|AgentSession|StackTarget $on,
        HookInput $input,
        DriverCapabilities $driver,
    ): HookAnswer {
        return $this->requests->answerHook($this->stackTargetOf($on), $input, $driver);
    }

    /**
     * The stack target of the agent of this name, of the session or the target itself.
     */
    private function stackTargetOf(string|AgentSession|StackTarget $on): StackTarget
    {
        return match (true) {
            is_string($on) => $this->sessionOf($on)->target,
            $on instanceof AgentSession => $on->target,
            default => $on,
        };
    }

    private function stateHandle(StateStack $stack, StateReference $reference): StateHandle
    {
        return new StateHandle(
            $this->app,
            $this->requests,
            $stack,
            $reference,
            $stack->onlyFrameOf($reference)->id,
            self::testDriver(),
        );
    }

    /**
     * The driver a state test answers hooks for: shell lines, file edits, finished tools and stops, rewrites without
     * approval.
     */
    private static function testDriver(): DriverCapabilities
    {
        return new DriverCapabilities(
            'Test driver',
            'pre-tool, post-tool and stop replies',
            ['onShellCommand', 'onFileEdit', 'onToolFinished', 'onStop'],
            RewriteSupport::WithoutApproval,
        );
    }
}
