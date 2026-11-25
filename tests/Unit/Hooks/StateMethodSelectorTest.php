<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Declarations\StateMethods;
use App\Enums\Engine\NoSubject;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\Values\StopDetails;
use App\Support\References\StateReference;
use App\Support\Stack\AgentStack;
use App\Support\Stack\Frames\Frame;
use App\Support\Stack\SelectedStateMethod;
use App\Support\Stack\StateMethodSelector;
use App\Support\States\AgentState;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Events\TaskStarted;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Hooks\InheritState;
use Tests\Fixtures\Hooks\InMemoryStateFactory;
use Tests\Support\TestActors;

final class StateMethodSelectorTest extends TestCase
{
    public function test_hooks_and_events_select_every_live_frame_that_declares_the_method_top_first(): void
    {
        $ordinary = new class extends InheritState
        {
            public function onStop(StopRequested $input): Decision
            {
                return Decision::delegate();
            }

            public function onTaskStarted(TaskStarted $event): void {}
        };
        $inherited = new class extends InheritState {};
        $finished = new class extends InheritState
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
            $this->frame('disabled', new InheritState(), isEnabled: false),
            $this->frame('finished', $finished),
            $this->frame('first', new InheritState()),
            $this->frame('default', $default),
        ], new InMemoryStateFactory(), new StackTarget('agent-1', 'session-1'));

        $selector = new StateMethodSelector(new StateMethods());
        $stop = new StopRequested(TestActors::hookIdentity(1, 2, '3', 'digest'), new StopDetails('turn', false, ''));
        $event = new TaskStarted('4', TestActors::agentIdentity(1), TaskState::Open, 'entry');

        $this->assertSelection($selector->forHook($stack, $stop), 'onStop');
        $this->assertSelection($selector->forEvent($stack, $event), 'onTaskStarted');
    }

    public function test_metadata_is_reflected_and_reused_without_creating_a_state(): void
    {
        $methods = new StateMethods();
        $first = $methods->forState(InheritState::class);

        $this->assertSame($first, $methods->forState(InheritState::class));
        $this->assertEqualsCanonicalizing(['onStop', TaskStarted::class], array_keys($first));
    }

    /**
     * @param  list<SelectedStateMethod>  $selection
     */
    private function assertSelection(array $selection, string $method): void
    {
        $this->assertSame(
            ['first', 'inherited', 'ordinary'],
            array_map(fn ($entry) => $entry->frame->id, $selection),
        );
        $this->assertSame($method, $selection[1]->method->name);
        $this->assertSame(InheritState::class, $selection[1]->method->declaringClass);
        $this->assertNotSame(InheritState::class, $selection[2]->method->declaringClass);
    }

    private function frame(string $id, AgentState $state, bool $isEnabled = true): Frame
    {
        return new Frame(
            $id,
            new StateReference($id, NoSubject::None),
            $state,
            CarbonImmutable::now(),
            isTypeEnabled: $isEnabled,
        );
    }
}
