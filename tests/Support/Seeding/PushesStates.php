<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Contracts\Work\StackTransaction;
use App\Enums\Drivers\RewriteSupport;
use App\Models\Agents\AgentSession;
use App\Support\AgentStacks;
use App\Support\Drivers\DriverCapabilities;
use App\Support\References\StateReference;
use App\Values\StackTarget;

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
     * The driver a state test answers hooks for: shell lines, finished tools and stops, rewrites without approval.
     */
    private static function testDriver(): DriverCapabilities
    {
        return new DriverCapabilities(
            'Test driver',
            'pre-tool, post-tool and stop replies',
            ['onShellCommand', 'onToolFinished', 'onStop'],
            RewriteSupport::WithoutApproval,
        );
    }
}
