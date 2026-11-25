<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Contracts\Events\Event;
use App\Contracts\Work\StackTransaction;
use App\Enums\Hooks\AnswerType;
use App\Models\Agents\AgentStackRow;
use App\Models\Support\AgentSessionScope;
use App\Support\AgentStacks;
use App\Support\EnginePass;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\References\StateReference;
use App\Support\Stack\Frames\Frame;
use App\Support\Stack\HookAnswer;
use App\Support\Stack\StackRestorer;
use App\Support\StateLoading\StateValues;
use App\Support\States\AgentState;
use App\Support\Storage\WalkStep;
use App\Support\TickDelivery;
use App\Values\StackTarget;
use Closure;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;
use PHPUnit\Framework\Assert;

/**
 * A state tested by a scenario on the real engine: the state is pushed onto the agent's stack through the stack
 * machinery, and each given step reaches it the way it does in the journal. A hook input goes through the agent's
 * state machine, an event is dispatched and delivered to the stacks that listen for it, and a tick runs an engine
 * pass. Nothing is called on the state by hand, so what the assertions see is what the journal does.
 */
final class StateScenario
{
    private HookAnswer|null $lastAnswer = null;

    /**
     * @param  Closure(HookInput): HookAnswer  $answerHook  sends a hook of the test's agent through its state machine
     */
    public function __construct(
        private readonly Container $app,
        private readonly StackTarget $target,
        private readonly StateReference $state,
        private readonly Closure $answerHook,
    ) {}

    /**
     * A step that runs one engine pass, so every ticking frame of the stack ticks once.
     */
    public static function tick(): ScenarioTick
    {
        return new ScenarioTick();
    }

    /**
     * Pushes the scenario's state onto the agent's stack.
     */
    public function pushed(): self
    {
        $this->app->make(StackTransaction::class)->run(
            fn () => $this->app->make(AgentStacks::class)->push($this->target, $this->state),
        );

        return $this;
    }

    /**
     * Runs each step in order: a hook input, an event or a tick.
     */
    public function given(HookInput|Event|ScenarioTick ...$steps): self
    {
        foreach ($steps as $step) {
            $this->run($step);
        }

        return $this;
    }

    /**
     * The answer the stack gave the last hook input.
     */
    public function lastAnswer(): HookAnswer
    {
        Assert::assertNotNull($this->lastAnswer, 'No hook input was given, so there is no answer to read.');

        return $this->lastAnswer;
    }

    /**
     * What the scenario's state itself answered the last hook input on the stack's walk: its own decision, before
     * any frame under it or the journal's admission of a shell line had a say.
     */
    public function lastStateAnswer(): AnswerType
    {
        $own = array_values(array_filter(
            $this->lastAnswer()->steps,
            fn (WalkStep $step) => $step->stateType === $this->state->typeKey,
        ));

        Assert::assertNotSame([], $own, "The state {$this->state->typeKey} was not asked the last hook input.");

        return $own[0]->answer;
    }

    /**
     * The scenario's state as the stack holds it now.
     */
    public function state(): AgentState
    {
        return $this->frame()->state;
    }

    /**
     * The values the scenario's state saves, by name.
     *
     * @return array<string, mixed>
     */
    public function values(): array
    {
        return StateValues::of($this->state());
    }

    public function assertActive(): self
    {
        Assert::assertFalse($this->frame()->isFinished(), "The state {$this->state->typeKey} has finished.");

        return $this;
    }

    public function assertPopped(): self
    {
        $live = array_filter(
            $this->frames(),
            fn (Frame $frame) => $frame->isFor($this->state) && ! $frame->isFinished(),
        );

        Assert::assertSame([], array_values($live), "The state {$this->state->typeKey} is still on the stack.");

        return $this;
    }

    /**
     * Asserts a live frame of this state type sits on the stack.
     */
    public function assertPushed(string $typeKey): self
    {
        $pushed = array_filter(
            $this->frames(),
            fn (Frame $frame) => $frame->typeKey() === $typeKey && ! $frame->isFinished(),
        );

        Assert::assertNotSame([], $pushed, "No live {$typeKey} frame is on the stack.");

        return $this;
    }

    private function run(HookInput|Event|ScenarioTick $step): void
    {
        if ($step instanceof HookInput) {
            $this->lastAnswer = ($this->answerHook)($step);

            return;
        }

        if ($step instanceof Event) {
            $this->app->make(StackTransaction::class)->run(
                fn () => $this->app->make(Dispatcher::class)->dispatch($step),
            );

            return;
        }

        $this->app->make(EnginePass::class)->run(
            fn () => $this->app->make(TickDelivery::class)->deliver(hrtime(true)),
        );
    }

    private function frame(): Frame
    {
        $own = array_values(array_filter($this->frames(), fn (Frame $frame) => $frame->isFor($this->state)));

        Assert::assertNotSame([], $own, "The state {$this->state->typeKey} is not on the stack.");

        return $own[count($own) - 1];
    }

    /**
     * @return list<Frame>
     */
    private function frames(): array
    {
        $row = AgentStackRow::query()->withoutGlobalScope(AgentSessionScope::class)->forTarget($this->target)->sole();

        return $this->app->make(StackRestorer::class)->restore($row->frames, $row->target)->frames();
    }
}
