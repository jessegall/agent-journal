<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Agents\Drivers\Capabilities\DriverCapabilities;
use App\Contracts\Events\Event;
use App\Contracts\Work\StackTransaction;
use App\Engine\EnginePass;
use App\Engine\TickDelivery;
use App\Stacks\HookAnswer;
use App\Stacks\References\StateReference;
use App\Support\Inputs\Contracts\HookInput;
use Closure;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Foundation\Application;
use Tests\Support\Assertions\StateAssert;
use Tests\Support\ScenarioTick;

/**
 * One state on a real stack, bound to its frame: each step reaches it the way it does in the journal, a hook through
 * the agent's state machine, a fact through the dispatcher and a tick through an engine pass, and the check after it
 * asserts the state as the engine left it.
 */
final class StateHandle
{
    public function __construct(
        private readonly Application $app,
        private readonly FixtureRequests $requests,
        private readonly StateStack $stack,
        private readonly StateReference $reference,
        private readonly string $frameId,
        private DriverCapabilities $driver,
    ) {}

    /**
     * Gives the steps in order and runs the check on the state after the last of them; no steps checks it as it is.
     *
     * @param  list<SessionHook|HookInput|Event|ScenarioTick>  $steps
     * @param  Closure(StateAssert): mixed  $check
     */
    public function steps(array $steps, Closure $check): self
    {
        $before = $this->stack->stack();
        $answer = null;
        $lastStep = '';

        foreach ($steps as $step) {
            $answer = $this->deliver($step);
            $lastStep = class_basename($step);
        }

        $check(new StateAssert($this->reference, $this->frameId, $before, $this->stack->stack(), $answer, $lastStep));

        return $this;
    }

    /**
     * The session wants to edit the files at these paths.
     *
     * @param  string|list<string>  $paths
     * @param  Closure(StateAssert): mixed  $check
     */
    public function fileEdit(string|array $paths, Closure $check): self
    {
        return $this->steps([SessionHook::fileEdit(...(array) $paths)], $check);
    }

    /**
     * The session wants to run the shell line, as the test's listed parser reads it.
     *
     * @param  Closure(StateAssert): mixed  $check
     */
    public function shell(string $line, Closure $check): self
    {
        return $this->steps([SessionHook::shell($line)], $check);
    }

    /**
     * @param  Closure(StateAssert): mixed  $check
     */
    public function toolFinished(string $command, Closure $check): self
    {
        return $this->steps([SessionHook::toolFinished($command)], $check);
    }

    /**
     * The session stops at the end of its first turn.
     *
     * @param  Closure(StateAssert): mixed  $check
     */
    public function stop(Closure $check): self
    {
        return $this->steps([SessionHook::stop()], $check);
    }

    /**
     * @param  Closure(StateAssert): mixed  $check
     */
    public function stopAfterRefusal(Closure $check): self
    {
        return $this->steps([SessionHook::stopAfterRefusal()], $check);
    }

    /**
     * The fact happens, sent through the dispatcher to its listeners as the journal sends it.
     *
     * @param  Closure(StateAssert): mixed  $check
     */
    public function event(Event $event, Closure $check): self
    {
        return $this->steps([$event], $check);
    }

    /**
     * One engine pass delivers a tick.
     *
     * @param  Closure(StateAssert): mixed  $check
     */
    public function tick(Closure $check): self
    {
        return $this->steps([new ScenarioTick()], $check);
    }

    /**
     * The same state answers hooks for another driver from here on.
     */
    public function answeredFor(DriverCapabilities $driver): self
    {
        $this->driver = $driver;

        return $this;
    }

    /**
     * The answer of a hook; none for a fact or a tick, which leave no answer to read.
     */
    private function deliver(SessionHook|HookInput|Event|ScenarioTick $step): HookAnswer|null
    {
        if ($step instanceof SessionHook) {
            return $this->deliver($step->inputFor($this->stack->target));
        }

        if ($step instanceof HookInput) {
            return $this->requests->answerHook($this->stack->target, $step, $this->driver);
        }

        if ($step instanceof Event) {
            $this->app->make(StackTransaction::class)->run(
                fn () => $this->app->make(Dispatcher::class)->dispatch($step),
            );

            return null;
        }

        $this->app->make(EnginePass::class)->run(fn () => $this->app->make(TickDelivery::class)->deliver(hrtime(true)));

        return null;
    }
}
