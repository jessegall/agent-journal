<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Contracts\Work\StackTransaction;
use App\Enums\Drivers\RewriteSupport;
use App\Models\Agents\AgentSession;
use App\Support\AgentStacks;
use App\Support\Drivers\DriverCapabilities;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\References\StateReference;
use App\Support\Stack\Frames\Frame;
use App\Support\Stack\HookAnswer;
use App\Values\StackTarget;
use PHPUnit\Framework\Assert;

/**
 * A state of a test on the real stack of an agent's session: pushed through the stack machinery inside the real
 * transaction under the agent's authority, or followed where a command already put it, bound to its one frame.
 */
trait PushesStates
{
    /**
     * Pushes the state onto the stack and binds the frame the push left for it, a new one or the one it reused.
     */
    public function pushState(AgentSession|StackTarget $on, StateReference $reference): StateHandle
    {
        $target = $on instanceof AgentSession ? $on->target : $on;
        $stack = new StateStack($this->app, $target);

        $this->requests->during(
            fn () => $this->requests->asAgent($target->agentId, $target->sessionId),
            fn () => $this->app->make(StackTransaction::class)->run(
                fn () => $this->app->make(AgentStacks::class)->push($target, $reference),
            ),
        );

        return $this->stateHandle($stack, $reference);
    }

    /**
     * The state a command already put on the stack, such as the work state a started task pushes, followed from there.
     */
    public function stateOn(AgentSession|StackTarget $on, StateReference $reference): StateHandle
    {
        $target = $on instanceof AgentSession ? $on->target : $on;

        return $this->stateHandle(new StateStack($this->app, $target), $reference);
    }

    /**
     * The session's stack holds no frame of the reference, live or finished.
     */
    public function assertNoFrame(AgentSession|StackTarget $on, StateReference $reference): self
    {
        $target = $on instanceof AgentSession ? $on->target : $on;
        $frames = array_filter(
            new StateStack($this->app, $target)->stack()->frames(),
            fn (Frame $frame) => $frame->isFor($reference),
        );

        Assert::assertSame([], array_values($frames), "The stack holds a {$reference->typeKey} frame.");

        return $this;
    }

    /**
     * Sends one hook through the session's state machine as its agent and returns the answer its stack gave.
     */
    public function answerHook(AgentSession|StackTarget $on, HookInput $input, DriverCapabilities $driver): HookAnswer
    {
        return $this->requests->answerHook($on instanceof AgentSession ? $on->target : $on, $input, $driver);
    }

    /**
     * The hook inputs of the session, signed for it.
     */
    public function hooksFor(AgentSession|StackTarget $on): SessionHooks
    {
        return new SessionHooks($on instanceof AgentSession ? $on->target : $on);
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
