<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\AgentRequests\Support\SignedCall;
use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Support\AgentContext;
use App\Agents\Support\StackTarget;
use App\Bus\Exceptions\StackLockTimedOut;
use App\Bus\Support\OperationDeadline;
use App\Hooks\Actions\AgentStacks;
use App\Hooks\Actions\StartStacks;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Events\StateTypesRequested;
use App\Hooks\Exceptions\InvalidBottomState;
use App\Hooks\Exceptions\StackAlreadyClosed;
use App\Hooks\Exceptions\StackMissing;
use App\Hooks\Exceptions\StackTransactionRequired;
use App\Hooks\Exceptions\StateTypeUnknown;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Storage\FrameRecord;
use App\Hooks\Storage\FrameRecords;
use App\Hooks\Storage\StoredFrames;
use App\Hooks\Support\StackTransaction;
use App\Settings\Models\SettingsRecord;
use App\Settings\Storage\EncodedToggle;
use App\Settings\Storage\EncodedValue;
use Carbon\CarbonImmutable;
use Domain\Tasks\Enums\TaskWorkState;
use Illuminate\Database\Connection;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Tests\Fixtures\Hooks\ClosureStateLoader;
use Tests\Fixtures\Hooks\DomainWrite;
use Tests\Fixtures\Hooks\InMemoryTaskLoader;
use Tests\Fixtures\Hooks\SwitchableState;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\UsesSecondConnection;
use Tests\TestCase;
use Throwable;

final class AgentStacksTest extends TestCase
{
    use RefreshHookDatabase;
    use UsesSecondConnection;

    private StackTarget $target;

    protected function setUp(): void
    {
        parent::setUp();

        AgentStackRow::query()->truncate();
        SettingsRecord::query()->truncate();
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
        $tasks = new InMemoryTaskLoader([42 => TaskWorkState::Active, 43 => TaskWorkState::Active]);
        Event::listen(
            StateTypesRequested::class,
            fn (StateTypesRequested $event) => $event->registry->register('test.tasks', $tasks),
        );
    }

    protected function tearDown(): void
    {
        Schema::dropIfExists('domain_writes');
        AgentStackRow::query()->truncate();
        SettingsRecord::query()->truncate();

        parent::tearDown();
    }

    public function test_creating_a_stack_gives_it_the_one_ready_bottom(): void
    {
        $this->transaction()->run(fn () => $this->startStacks()->open($this->target));

        $frames = $this->storedFrames();

        $this->assertCount(1, $frames);
        $this->assertTrue($frames[0]->isBottom);
        $this->assertSame('hooks.ready', $frames[0]->reference->typeKey);
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
        $this->insertStackThrough($this->otherConnection(), 'racer-ready', 'hooks.ready');

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
            ['hooks.ready', 'test.tasks'],
            array_map(fn (FrameRecord $frame) => $frame->reference->typeKey, $this->storedFrames()),
        );
        $this->assertSame(['task 42 started'], DomainWrite::names());
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

    public function test_pushing_a_state_already_on_the_stack_adds_nothing(): void
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
            $event->registry->register(
                'test.switched_off',
                new ClosureStateLoader(fn () => new SwitchableState(false)),
            );
            $event->registry->register('test.switched_on', new ClosureStateLoader(fn () => new SwitchableState(true)));
        });
        $this->createStack();

        $this->transaction()->run(
            fn () => $this->stacks()->push($this->target, new StateReference('test.switched_off', NoSubject::None)),
        );
        $this->assertSame(
            ['hooks.ready'],
            array_map(fn (FrameRecord $frame) => $frame->reference->typeKey, $this->storedFrames()),
        );

        $this->transaction()->run(
            fn () => $this->stacks()->push($this->target, new StateReference('test.switched_on', NoSubject::None)),
        );
        $this->assertSame(
            ['hooks.ready', 'test.switched_on'],
            array_map(fn (FrameRecord $frame) => $frame->reference->typeKey, $this->storedFrames()),
        );
    }

    public function test_a_push_saves_the_stack_without_a_frame_switched_off_since_it_was_stored(): void
    {
        $enabled = true;
        Event::listen(StateTypesRequested::class, function (StateTypesRequested $event) use (&$enabled): void {
            $event->registry->register('test.switchable', new ClosureStateLoader(function () use (&$enabled) {
                return new SwitchableState($enabled);
            }));
        });
        $this->createStack();
        $this->transaction()->run(
            fn () => $this->stacks()->push($this->target, new StateReference('test.switchable', NoSubject::None)),
        );

        $enabled = false;
        $this->transaction()->run(fn () => $this->stacks()->push($this->target, $this->task(42)));

        $this->assertSame(
            ['hooks.ready', 'test.tasks'],
            array_map(fn (FrameRecord $frame) => $frame->reference->typeKey, $this->storedFrames()),
        );
    }

    public function test_a_push_of_a_switched_off_domains_state_is_declined_without_reading_its_subject(): void
    {
        SettingsRecord::insertIfAbsent('Core');
        $core = SettingsRecord::sharedRuntimeForOwner('Core')->get();
        $core->revise($core->document->withToggle(new EncodedToggle('domain_plans', EncodedValue::of(false))));
        $this->createStack();

        $this->transaction()->run(
            fn () => $this->stacks()->push(
                $this->target,
                new StateReference('plans.working', new SubjectReference(TestIds::of(999), 1)),
            ),
        );

        $this->assertSame(
            ['hooks.ready'],
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

    /**
     * @return array<int, string>
     */
    protected function connectionsToTransact(): array
    {
        return [];
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
        return new StateReference('test.tasks', new SubjectReference((string) $number, 1));
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
