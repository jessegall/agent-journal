<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Enums\NoSubject;
use App\Events\Hooks\StateTypesRequested;
use App\Exceptions\InvalidBottomState;
use App\Exceptions\StackAlreadyClosed;
use App\Exceptions\StackLockTimedOut;
use App\Exceptions\StackMissing;
use App\Exceptions\StackTargetRefused;
use App\Exceptions\StackTransactionRequired;
use App\Exceptions\StateTypeUnknown;
use App\Models\Agents\AgentStackRow;
use App\Models\Records\SettingsRecord;
use App\Support\AgentContext;
use App\Support\AgentStacks;
use App\Support\OperationDeadline;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;
use App\Support\SignedCall;
use App\Support\Stack\AgentStack;
use App\Support\Stack\StackRestorer;
use App\Support\Stack\StateTypes;
use App\Support\StackTransaction;
use App\Support\StartStacks;
use App\Support\StateLoading\RegisteredStateType;
use App\Support\Storage\EncodedToggle;
use App\Support\Storage\EncodedValue;
use App\Support\Storage\FrameRecord;
use App\Support\Storage\FrameRecords;
use App\Support\Storage\StoredFrames;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Domain\Tasks\Enums\TaskState;
use Illuminate\Database\Connection;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Tests\Fixtures\Hooks\Counting\CountState;
use Tests\Fixtures\Hooks\DomainWrite;
use Tests\Fixtures\Hooks\InMemoryTasks;
use Tests\Fixtures\Hooks\InMemoryTaskState;
use Tests\Fixtures\Hooks\SwitchableState;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\UsesSecondConnection;
use Tests\TestCase;
use Throwable;

final class AgentStacksTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['agent_stacks', 'settings_records'];

    use UsesSecondConnection;

    private StackTarget $target;

    protected function setUp(): void
    {
        parent::setUp();

        Schema::dropIfExists('domain_writes');
        Schema::create('domain_writes', fn (Blueprint $table) => $table->string('name'));

        $this->target = TestActors::stack(1, 10);
        $this->app->instance(
            AgentContext::class,
            new AgentContext(
                TestIds::of(1),
                TestIds::of(10),
                new SignedCall('call-1', CarbonImmutable::now(), str_repeat('a', 64)),
                null,
            ),
        );
        $this->app->instance(InMemoryTasks::class, new InMemoryTasks([42 => TaskState::Started, 43 => TaskState::Started]));
        Event::listen(
            StateTypesRequested::class,
            fn (StateTypesRequested $event) => $event->registry->register(
                RegisteredStateType::named('test.tasks', InMemoryTaskState::class),
            ),
        );
        Event::listen(
            StateTypesRequested::class,
            fn (StateTypesRequested $event) => $event->registry->register(
                RegisteredStateType::named('test.counting', CountState::class),
            ),
        );
    }

    protected function tearDown(): void
    {
        Schema::dropIfExists('domain_writes');

        parent::tearDown();
    }

    public function test_creating_a_stack_gives_it_the_one_ready_bottom(): void
    {
        $this->transaction()->run(fn () => $this->startStacks()->open($this->target));

        $frames = $this->storedFrames();

        $this->assertCount(1, $frames);
        $this->assertTrue($frames[0]->isBottom);
        $this->assertSame('core.ready', $frames[0]->reference->typeKey);
    }

    public function test_creating_the_same_stack_again_leaves_the_first_one(): void
    {
        $this->transaction()->run(fn () => $this->startStacks()->open($this->target));
        $firstFrameId = $this->storedFrames()[0]->id;

        $this->transaction()->run(fn () => $this->startStacks()->open($this->target));

        $this->assertSame(1, AgentStackRow::query()->acrossEveryAgent()->count());
        $this->assertSame($firstFrameId, $this->storedFrames()[0]->id);
    }

    public function test_a_stack_a_racing_start_committed_first_is_kept_and_the_transaction_goes_on(): void
    {
        $this->insertStackThrough($this->otherConnection(), 'racer-ready', 'core.ready');

        $this->transaction()->run(function (): void {
            $this->startStacks()->open($this->target);
            DomainWrite::query()->insert(['name' => 'after the race']);
        });

        $this->assertSame('racer-ready', $this->storedFrames()[0]->id);
        $this->assertSame(['after the race'], DomainWrite::names());
    }

    public function test_a_racing_stack_with_another_bottom_type_is_refused(): void
    {
        $this->insertStackThrough($this->otherConnection(), 'racer-ready', 'hooks.main_ready');

        $this->expectException(InvalidBottomState::class);

        $this->transaction()->run(fn () => $this->startStacks()->open($this->target));
    }

    public function test_a_stack_changes_only_inside_a_transaction(): void
    {
        $this->expectException(StackTransactionRequired::class);

        $this->startStacks()->open($this->target);
    }

    public function test_a_push_commits_together_with_the_domain_write(): void
    {
        $this->createStack();

        $this->transaction()->run(function (): void {
            DomainWrite::query()->insert(['name' => 'task 42 started']);
            $this->stacks()->push($this->target, $this->task(42));
        });

        $this->assertSame(
            ['core.ready', 'test.tasks'],
            array_map(fn (FrameRecord $frame) => $frame->reference->typeKey, $this->storedFrames()),
        );
        $this->assertSame(['task 42 started'], DomainWrite::names());
    }

    public function test_a_state_keeps_its_own_values_through_a_reload_of_its_stack(): void
    {
        $this->createStack();
        $this->transaction()->run(
            fn () => $this->stacks()->push($this->target, new StateReference('test.counting', NoSubject::None)),
        );

        $this->transaction()->run(function (): void {
            $stack = $this->reloadedStack();
            $this->countingStateOf($stack)->count();
            $this->countingStateOf($stack)->count();
            AgentStackRow::query()->forTarget($this->target)->sole()
                ->saveFrames($stack->records(), $this->app->make(StateTypes::class)->ticking());
        });

        $this->assertSame(['values' => ['count' => 2]], $this->storedFrames()[1]->values);
        $this->assertSame(2, $this->countingStateOf($this->reloadedStack())->counted());
        $this->assertSame(['openAttempts' => [], 'settledAttempts' => []], $this->storedFrames()[0]->values);
    }

    public function test_a_failed_push_rolls_the_domain_write_back(): void
    {
        $this->createStack();

        try {
            $this->transaction()->run(function (): void {
                DomainWrite::query()->insert(['name' => 'note opened']);
                $this->stacks()->push($this->target, new StateReference('notes.reading', NoSubject::None));
            });
            $this->fail('The push of an unknown state type went through.');
        } catch (StateTypeUnknown) {
            $this->assertSame([], DomainWrite::names());
            $this->assertCount(1, $this->storedFrames());
        }
    }

    public function test_pushing_a_state_that_is_not_unique_again_adds_a_frame_of_its_own(): void
    {
        $this->createStack();
        $counting = new StateReference('test.counting', NoSubject::None);

        $this->transaction()->run(fn () => $this->stacks()->push($this->target, $counting));
        $this->transaction()->run(fn () => $this->stacks()->push($this->target, $counting));

        $this->assertSame(
            ['core.ready', 'test.counting', 'test.counting'],
            array_map(fn (FrameRecord $frame) => $frame->reference->typeKey, $this->storedFrames()),
        );
    }

    public function test_pushing_a_unique_state_already_on_the_stack_adds_nothing(): void
    {
        $this->createStack();

        $this->transaction()->run(fn () => $this->stacks()->push($this->target, $this->task(42)));
        $this->transaction()->run(fn () => $this->stacks()->push($this->target, $this->task(43)));
        $this->transaction()->run(fn () => $this->stacks()->push($this->target, $this->task(42)));

        $this->assertSame(
            [null, '42', '43'],
            array_map(
                fn (
                    FrameRecord $frame,
                ) => $frame->reference->subject instanceof SubjectReference ? $frame->reference->subject->id : null,
                $this->storedFrames(),
            ),
        );
    }

    public function test_a_switched_off_conditional_state_is_declined_and_a_switched_on_one_is_pushed(): void
    {
        Event::listen(StateTypesRequested::class, function (StateTypesRequested $event): void {
            $event->registry->register(RegisteredStateType::named('test.switched_off', SwitchableState::class));
            $event->registry->register(RegisteredStateType::named('test.switched_on', SwitchableState::class));
        });
        $this->createStack();

        $this->transaction()->run(
            fn () => $this->stacks()->push($this->target, new StateReference('test.switched_off', NoSubject::None, ['enabled' => false])),
        );
        $this->assertSame(
            ['core.ready'],
            array_map(fn (FrameRecord $frame) => $frame->reference->typeKey, $this->storedFrames()),
        );

        $this->transaction()->run(
            fn () => $this->stacks()->push($this->target, new StateReference('test.switched_on', NoSubject::None, ['enabled' => true])),
        );
        $this->assertSame(
            ['core.ready', 'test.switched_on'],
            array_map(fn (FrameRecord $frame) => $frame->reference->typeKey, $this->storedFrames()),
        );
    }

    public function test_a_push_saves_the_stack_without_a_frame_switched_off_since_it_was_stored(): void
    {
        $enabled = true;
        Event::listen(StateTypesRequested::class, function (StateTypesRequested $event) use (&$enabled): void {
            $event->registry->register(
                RegisteredStateType::named('test.switchable', SwitchableState::class)->switchedBy(
                    function () use (&$enabled): bool {
                        return $enabled;
                    },
                ),
            );
        });
        $this->createStack();
        $this->transaction()->run(
            fn () => $this->stacks()->push($this->target, new StateReference('test.switchable', NoSubject::None, ['enabled' => true])),
        );

        $enabled = false;
        $this->transaction()->run(fn () => $this->stacks()->push($this->target, $this->task(42)));

        $this->assertSame(
            ['core.ready', 'test.tasks'],
            array_map(fn (FrameRecord $frame) => $frame->reference->typeKey, $this->storedFrames()),
        );
    }

    public function test_a_push_of_a_switched_off_domains_state_is_declined_without_reading_its_subject(): void
    {
        SettingsRecord::create('Core');
        $core = SettingsRecord::sharedRuntimeForOwner('Core')->get();
        $core->revise($core->document->withToggle(new EncodedToggle('domain_plans', EncodedValue::of(false))));
        $this->createStack();

        $this->transaction()->run(
            fn () => $this->stacks()->push(
                $this->target,
                new StateReference('plans.work', new SubjectReference(TestIds::of(999), 1)),
            ),
        );

        $this->assertSame(
            ['core.ready'],
            array_map(fn (FrameRecord $frame) => $frame->reference->typeKey, $this->storedFrames()),
        );
    }

    public function test_a_push_onto_another_agents_stack_is_refused(): void
    {
        $this->expectException(StackTargetRefused::class);

        $this->transaction()->run(fn () => $this->stacks()->push(TestActors::stack(2, 20), $this->task(42)));
    }

    public function test_a_push_without_a_stack_or_onto_a_closed_stack_is_refused(): void
    {
        try {
            $this->transaction()->run(fn () => $this->stacks()->push($this->target, $this->task(42)));
            $this->fail('A push without a stack went through.');
        } catch (StackMissing) {
            $this->createStack();
        }

        AgentStackRow::query()->sole()->closeAt(CarbonImmutable::now());

        $this->expectException(StackAlreadyClosed::class);

        $this->transaction()->run(fn () => $this->stacks()->push($this->target, $this->task(42)));
    }

    public function test_a_push_waiting_on_a_held_lock_times_out_and_rolls_everything_back(): void
    {
        $this->createStack();
        $other = $this->otherConnection();
        $other->beginTransaction();
        $other->table('agent_stacks')->lockForUpdate()->get();

        try {
            $this->transaction()->runWithin(new OperationDeadline(300), function (): void {
                DomainWrite::query()->insert(['name' => 'waiting write']);
                $this->stacks()->push($this->target, $this->task(42));
            });
            $this->fail('The push did not time out.');
        } catch (StackLockTimedOut $timedOut) {
            $this->assertInstanceOf(Throwable::class, $timedOut->getPrevious());
        } finally {
            $other->rollBack();
        }

        $this->assertSame([], DomainWrite::names());
        $this->assertCount(1, $this->storedFrames());
    }

    public function test_the_limits_are_set_before_the_work_and_kept_by_a_nested_operation(): void
    {
        $settings = $this->transaction()->run(function (): array {
            $outer = $this->timeouts();
            $inner = $this->transaction()->runWithin(new OperationDeadline(100), fn () => $this->timeouts());

            return [$outer, $inner];
        });

        $this->assertSame([['4s', '5s'], ['4s', '5s']], $settings);
        $this->assertSame(5000, $this->app->make(OperationDeadline::class)->milliseconds);
    }

    public function test_a_caller_transaction_without_limits_is_refused_before_the_work_runs(): void
    {
        $ran = false;

        try {
            DB::transaction(fn () => $this->transaction()->run(function () use (&$ran): void {
                $ran = true;
            }));
            $this->fail('A transaction without limits was joined.');
        } catch (StackTransactionRequired) {
            $this->assertFalse($ran);
        }
    }

    private function startStacks(): StartStacks
    {
        return $this->app->make(StartStacks::class);
    }

    private function stacks(): AgentStacks
    {
        return $this->app->make(AgentStacks::class);
    }

    private function transaction(): StackTransaction
    {
        return $this->app->make(StackTransaction::class);
    }

    private function createStack(): void
    {
        $this->transaction()->run(fn () => $this->startStacks()->open($this->target));
    }

    private function task(int $number): StateReference
    {
        return new StateReference('test.tasks', new SubjectReference((string) $number, 1), ['number' => $number, 'runNumber' => 1]);
    }

    private function reloadedStack(): AgentStack
    {
        $row = AgentStackRow::query()->forTarget($this->target)->sole();

        return $this->app->make(StackRestorer::class)->restore($row->frames, $row->target());
    }

    private function countingStateOf(AgentStack $stack): CountState
    {
        $state = $stack->top()->state;
        $this->assertInstanceOf(CountState::class, $state);

        return $state;
    }

    /**
     * @return list<FrameRecord>
     */
    private function storedFrames(): array
    {
        return AgentStackRow::query()->forTarget($this->target)->sole()->frames->all();
    }

    /**
     * @return array{string, string}
     */
    private function timeouts(): array
    {
        return [
            (string) DB::scalar("SELECT current_setting('lock_timeout')"),
            (string) DB::scalar("SELECT current_setting('statement_timeout')"),
        ];
    }

    private function insertStackThrough(Connection $connection, string $frameId, string $typeKey): void
    {
        $frames = new FrameRecords(
            [new FrameRecord($frameId, new StateReference($typeKey, NoSubject::None), true, 1, CarbonImmutable::now())],
        );

        $connection->table('agent_stacks')->insert([
            'id' => strtolower((string) Str::ulid()),
            'agent_id' => $this->target->agentId,
            'session_id' => $this->target->sessionId,
            'version' => 1,
            'frames' => StoredFrames::fromFrameRecords($frames)->toJson(),
            'status' => 'active',
            'created_at' => CarbonImmutable::now(),
            'updated_at' => CarbonImmutable::now(),
        ]);
    }
}
