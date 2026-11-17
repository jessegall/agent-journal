<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Core\Agents\AgentContext;
use App\Core\Agents\SignedCall;
use App\Core\Hooks\AgentStacks;
use App\Core\Hooks\Decisions\NoSubject;
use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\Decisions\SubjectReference;
use App\Core\Hooks\Events\StateTypesRequested;
use App\Core\Hooks\LaunchStacks;
use App\Core\Hooks\Models\AgentStackRow;
use App\Core\Hooks\Models\StackAlreadyClosed;
use App\Core\Hooks\Models\StackMissing;
use App\Core\Hooks\OperationDeadline;
use App\Core\Hooks\StackLockTimedOut;
use App\Core\Hooks\StackTargetRefused;
use App\Core\Hooks\StackTransaction;
use App\Core\Hooks\StackTransactionRequired;
use App\Core\Hooks\States\ReadyStateType;
use App\Core\Hooks\States\StateTypeUnknown;
use App\Core\Hooks\Storage\FrameRecord;
use App\Core\Hooks\Storage\FrameRecords;
use App\Core\Hooks\Storage\InvalidBottomState;
use App\Core\Hooks\Storage\StackTarget;
use App\Core\Hooks\Storage\StoredFrames;
use App\Domain\Tasks\TaskWorkState;
use Carbon\CarbonImmutable;
use Illuminate\Database\Connection;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Hooks\InMemoryTaskType;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;
use Throwable;

final class AgentStacksTest extends TestCase
{
    use RefreshHookDatabase;

    private StackTarget $target;

    protected function setUp(): void
    {
        parent::setUp();

        DB::table('agent_stacks')->truncate();
        Schema::dropIfExists('domain_writes');
        Schema::create('domain_writes', fn (Blueprint $table) => $table->string('name'));

        $this->target = new StackTarget(1, 10);
        $this->app->instance(AgentContext::class, new AgentContext(1, 10, 'hooks.main_ready', new SignedCall('call-1', CarbonImmutable::now(), str_repeat('a', 64))));
        $tasks = new InMemoryTaskType([42 => TaskWorkState::Active, 43 => TaskWorkState::Active]);
        Event::listen(StateTypesRequested::class, fn (StateTypesRequested $event) => $event->registry->register('test.tasks', $tasks));
    }

    protected function tearDown(): void
    {
        if ($this->app->make('config')->has('database.connections.hooks_other')) {
            DB::connection('hooks_other')->disconnect();
        }
        Schema::dropIfExists('domain_writes');
        DB::table('agent_stacks')->truncate();

        parent::tearDown();
    }

    public function test_creating_a_stack_gives_it_one_bottom_state_of_the_role(): void
    {
        $this->transaction()->run(fn () => $this->launchStacks()->open($this->target, ReadyStateType::MainAgent));

        $frames = $this->storedFrames();

        $this->assertCount(1, $frames);
        $this->assertTrue($frames[0]->isBottom);
        $this->assertSame('hooks.main_ready', $frames[0]->reference->typeKey);
    }

    public function test_creating_the_same_stack_again_leaves_the_first_one(): void
    {
        $this->transaction()->run(fn () => $this->launchStacks()->open($this->target, ReadyStateType::MainAgent));
        $firstFrameId = $this->storedFrames()[0]->id;

        $this->transaction()->run(fn () => $this->launchStacks()->open($this->target, ReadyStateType::MainAgent));

        $this->assertSame(1, DB::table('agent_stacks')->count());
        $this->assertSame($firstFrameId, $this->storedFrames()[0]->id);
    }

    public function test_a_stack_a_racing_launch_committed_first_is_kept_and_the_transaction_goes_on(): void
    {
        $this->insertStackThrough($this->otherConnection(), 'racer-ready', 'hooks.main_ready');

        $this->transaction()->run(function (): void {
            $this->launchStacks()->open($this->target, ReadyStateType::MainAgent);
            DB::table('domain_writes')->insert(['name' => 'after the race']);
        });

        $this->assertSame('racer-ready', $this->storedFrames()[0]->id);
        $this->assertSame(['after the race'], DB::table('domain_writes')->pluck('name')->all());
    }

    public function test_a_racing_stack_of_another_role_is_refused(): void
    {
        $this->insertStackThrough($this->otherConnection(), 'racer-ready', 'hooks.read_only_helper_ready');

        $this->expectException(InvalidBottomState::class);

        $this->transaction()->run(fn () => $this->launchStacks()->open($this->target, ReadyStateType::MainAgent));
    }

    public function test_a_stack_changes_only_inside_a_transaction(): void
    {
        $this->expectException(StackTransactionRequired::class);

        $this->launchStacks()->open($this->target, ReadyStateType::MainAgent);
    }

    public function test_a_push_commits_together_with_the_domain_write(): void
    {
        $this->createStack();

        $this->transaction()->run(function (): void {
            DB::table('domain_writes')->insert(['name' => 'task 42 started']);
            $this->stacks()->push($this->target, $this->task(42));
        });

        $this->assertSame(['hooks.main_ready', 'test.tasks'], array_map(fn (FrameRecord $frame) => $frame->reference->typeKey, $this->storedFrames()));
        $this->assertSame(['task 42 started'], DB::table('domain_writes')->pluck('name')->all());
    }

    public function test_a_failed_push_rolls_the_domain_write_back(): void
    {
        $this->createStack();

        try {
            $this->transaction()->run(function (): void {
                DB::table('domain_writes')->insert(['name' => 'note opened']);
                $this->stacks()->push($this->target, new StateReference('notes.reading', NoSubject::None));
            });
            $this->fail('The push of an unknown state type went through.');
        } catch (StateTypeUnknown) {
            $this->assertSame(0, DB::table('domain_writes')->count());
            $this->assertCount(1, $this->storedFrames());
        }
    }

    public function test_pushing_a_state_already_on_the_stack_adds_nothing(): void
    {
        $this->createStack();

        $this->transaction()->run(fn () => $this->stacks()->push($this->target, $this->task(42)));
        $this->transaction()->run(fn () => $this->stacks()->push($this->target, $this->task(43)));
        $this->transaction()->run(fn () => $this->stacks()->push($this->target, $this->task(42)));

        $this->assertSame([null, 42, 43], array_map(fn (FrameRecord $frame) => $frame->reference->subject instanceof SubjectReference ? $frame->reference->subject->id : null, $this->storedFrames()));
    }

    public function test_a_push_onto_another_agents_stack_is_refused(): void
    {
        $this->expectException(StackTargetRefused::class);

        $this->transaction()->run(fn () => $this->stacks()->push(new StackTarget(2, 20), $this->task(42)));
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
        $startedAt = microtime(true);

        try {
            $this->transaction()->runWithin(new OperationDeadline(300), function (): void {
                DB::table('domain_writes')->insert(['name' => 'waiting write']);
                $this->stacks()->push($this->target, $this->task(42));
            });
            $this->fail('The push did not time out.');
        } catch (StackLockTimedOut $timedOut) {
            $this->assertLessThan(2.0, microtime(true) - $startedAt);
            $this->assertInstanceOf(Throwable::class, $timedOut->getPrevious());
        } finally {
            $other->rollBack();
        }

        $this->assertSame(0, DB::table('domain_writes')->count());
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

    private function launchStacks(): LaunchStacks
    {
        return $this->app->make(LaunchStacks::class);
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
        $this->transaction()->run(fn () => $this->launchStacks()->open($this->target, ReadyStateType::MainAgent));
    }

    private function task(int $number): StateReference
    {
        return new StateReference('test.tasks', new SubjectReference($number, 1));
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

    private function otherConnection(): Connection
    {
        $config = $this->app->make('config');
        $config->set('database.connections.hooks_other', $config->get('database.connections.'.$config->get('database.default')));

        return DB::connection('hooks_other');
    }

    private function insertStackThrough(Connection $connection, string $frameId, string $typeKey): void
    {
        $frames = new FrameRecords([new FrameRecord($frameId, new StateReference($typeKey, NoSubject::None), true, 1)]);

        $connection->table('agent_stacks')->insert([
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
