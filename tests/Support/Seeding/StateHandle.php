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
use Tests\Support\ScenarioTick;

/**
 * One state on a real stack, bound to its frame: each given step reaches it the way it does in the journal, a hook
 * through the agent's state machine, a fact through the dispatcher and a tick through an engine pass, and the check
 * after it sees the stack as the engine left it.
 */
final readonly class StateHandle
{
    public function __construct(
        private Application $app,
        private FixtureRequests $requests,
        private StateStack $stack,
        private StateReference $reference,
        private string $frameId,
        private DriverCapabilities $driver,
    ) {}

    /**
     * Gives the step, or the steps in order, and runs the check on the state after the last of them.
     *
     * @param  HookInput|Event|ScenarioTick|list<HookInput|Event|ScenarioTick>  $steps
     * @param  Closure(StateObservation): void  $check
     */
    public function given(HookInput|Event|ScenarioTick|array $steps, Closure $check): self
    {
        $before = $this->stack->stack();
        $answer = null;
        $lastStep = '';

        foreach (is_array($steps) ? $steps : [$steps] as $step) {
            $answer = $this->deliver($step);
            $lastStep = class_basename($step);
        }

        $check(
            new StateObservation($this->reference, $this->frameId, $before, $this->stack->stack(), $answer, $lastStep),
        );

        return $this;
    }

    /**
     * The same state answering hooks for another driver.
     */
    public function answeredFor(DriverCapabilities $driver): self
    {
        return clone ($this, ['driver' => $driver]);
    }

    /**
     * The answer of a hook input; none for a fact or a tick, which leave no answer to read.
     */
    private function deliver(HookInput|Event|ScenarioTick $step): HookAnswer|null
    {
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
