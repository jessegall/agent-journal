<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Agents\Values\StackTarget;
use App\Hooks\Decisions\Decision;
use App\Hooks\Declarations\StateMethods;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Enums\SelectionReason;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\Inputs\Values\StopDetails;
use App\Hooks\References\StateReference;
use App\Hooks\Stack\AgentStack;
use App\Hooks\Stack\Frames\Frame;
use App\Hooks\Stack\SelectedStateMethod;
use App\Hooks\Stack\StateMethodSelector;
use App\Hooks\States\AgentState;
use App\Hooks\Values\EventCommands;
use Carbon\CarbonImmutable;
use Domain\Tasks\Events\TaskStarted;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Hooks\ClosureStateLoader;
use Tests\Fixtures\Hooks\InMemoryStateFactory;
use Tests\Fixtures\Hooks\MarkedState;
use Tests\Support\Exceptions\SimulatedFailure;
use Tests\Support\TestActors;

final class StateMethodSelectorTest extends TestCase
{
    public function test_hooks_and_events_select_the_first_match_and_lower_effective_markers(): void
    {
        $ordinary = new class extends MarkedState
        {
            public function onStop(StopRequested $input): Decision
            {
                return Decision::delegate();
            }

            public function onTaskStarted(TaskStarted $event): EventCommands
            {
                return EventCommands::none();
            }
        };
        $inherited = new class extends MarkedState {};
        $finished = new class extends MarkedState
        {
            public function isFinished(): bool
            {
                return true;
            }
        };
        $default = new class extends AgentState {};
        $stack = new AgentStack([
            $this->frame('ordinary', $ordinary),
            $this->frame('inherited', $inherited),
            $this->frame('disabled', new MarkedState(), enabled: false),
            $this->frame('finished', $finished),
            $this->frame('first', new MarkedState()),
            $this->frame('default', $default),
        ], new InMemoryStateFactory(), new StackTarget('agent-1', 'session-1'));

        $selector = new StateMethodSelector(new StateMethods());
        $stop = new StopRequested(TestActors::hookIdentity(1, 2, '3', 'digest'), new StopDetails('turn', false));
        $event = new TaskStarted('4', TestActors::agentIdentity(1));

        $this->assertSelection($selector->forHook($stack, $stop), 'onStop');
        $this->assertSelection($selector->forEvent($stack, $event), 'onTaskStarted');
    }

    public function test_metadata_is_reflected_and_reused_without_creating_a_state(): void
    {
        $loader = new ClosureStateLoader(MarkedState::class, fn () => throw SimulatedFailure::of('Unexpected load.'));
        $methods = new StateMethods();
        $first = $methods->forLoader($loader);

        $this->assertSame($first, $methods->forState(MarkedState::class));
        $this->assertEqualsCanonicalizing(['onStop', TaskStarted::class], array_keys($first));
        $this->assertTrue($first[TaskStarted::class]->stackWide);
    }

    /**
     * @param  list<SelectedStateMethod>  $selection
     */
    private function assertSelection(array $selection, string $method): void
    {
        $this->assertSame(['first', 'inherited'], array_map(fn ($entry) => $entry->frame->id, $selection));
        $this->assertSame(
            [SelectionReason::FirstMatch, SelectionReason::StackWide],
            array_map(fn ($entry) => $entry->reason, $selection),
        );
        $this->assertSame($method, $selection[1]->method->name);
        $this->assertSame(MarkedState::class, $selection[1]->method->declaringClass);
    }

    private function frame(string $id, AgentState $state, bool $enabled = true): Frame
    {
        return new Frame(
            $id,
            new StateReference($id, NoSubject::None),
            $state,
            CarbonImmutable::now(),
            typeEnabled: $enabled,
        );
    }
}
