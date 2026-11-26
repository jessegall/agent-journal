<?php

declare(strict_types=1);

namespace Tests\Middleware;

use App\Bus\CommandCall;
use App\Bus\CommandMiddleware\RunInTransaction;
use App\Bus\CommandNesting;
use App\Bus\Contracts\CommandBus;
use App\Bus\EventUnit;
use App\Bus\EventUnitLifecycle;
use App\Bus\Exceptions\CausalDepthExceeded;
use App\Bus\Exceptions\CommandRefused;
use App\Bus\Exceptions\CommandTransactionMismatch;
use App\Bus\Exceptions\CommittedFactListenerFailed;
use App\Bus\Exceptions\EventUnitRefused;
use App\Bus\Exceptions\ExplicitTransactionInCommand;
use App\Bus\Exceptions\NestedCommandFailureIgnored;
use App\Bus\Exceptions\RaisedOutsideUnit;
use App\Bus\ListenerRegistry;
use App\Bus\OutsideCommandAllowance;
use App\Bus\Publication;
use App\Bus\TransactionListenerDrain;
use App\Support\ActiveEventUnits;
use App\Support\StackTransaction;
use Domain\Rules\RulesDomain;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\TasksDomain;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\DatabaseManager;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Events\CallQueuedListener;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Schema;
use RuntimeException;
use Tests\Fixtures\Contracts\NotesFirstRename;
use Tests\Fixtures\Contracts\QueuedRenameListener;
use Tests\Fixtures\Contracts\RaisingRow;
use Tests\Fixtures\Contracts\RenamesAgain;
use Tests\Fixtures\Contracts\RowNoted;
use Tests\Fixtures\Contracts\RowRenamed;
use Tests\Fixtures\ModelWrites\Models\OwnRowWriter;
use Tests\Fixtures\Modules\Notes\Commands\AuditNote\AuditNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\CopyNote\CopyNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\IgnoreFailedNote\IgnoreFailedNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\OpenTransactionNote\OpenTransactionNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\PinNote\PinNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\RefuseNote\RefuseNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote\WriteNoteCommand;
use Tests\Fixtures\Modules\Notes\Events\NoteAudited;
use Tests\Fixtures\Modules\Notes\Exceptions\NoteWorkFailed;
use Tests\Support\Bus\RunsModuleCommands;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMiddleware;
use Tests\Support\TestIds;
use Tests\TestCase;
use WeakReference;

/**
 * One transaction per command, in the command's isolation, with its event unit: a nested command joins it, a refusal or
 * an ignored inner failure rolls all of it back, a handler may not open its own; the facts it raises are held until it
 * commits and go out once, in order, and never after a rollback.
 */
#[TestsMiddleware(RunInTransaction::class)]
final class RunInTransactionTest extends TestCase
{
    use RunsModuleCommands;

    /**
     * The tables these tests commit to, emptied around each test.
     */
    private const array TABLES = [];

    private const string ISOLATION = 'repeatable read';

    private const string FAILURE = 'the operation failed';

    private const string INNER_FAILURE = 'inner command failed';

    /**
     * The transaction level each hearing of the audit happened at.
     *
     * @var list<int>
     */
    private array $heardAt = [];

    /**
     * @var list<string>
     */
    private array $heard = [];

    /**
     * The domains these tests use beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class, TasksDomain::class);
    }

    public function test_a_command_commits_in_its_isolation_and_a_repeatable_read_command_gets_its_own(): void
    {
        $this->installCommandModules();
        $this->journal->actAsUserId(TestIds::of(1));
        $bus = $this->app->make(CommandBus::class);

        $id = $bus->run(new WriteNoteCommand('kept'));

        $this->assertSame('kept', $this->rowText($id));
        $this->assertSame(self::ISOLATION, $bus->run(new PinNoteCommand($id)));
        $this->assertSame(0, $this->app->make(ConnectionInterface::class)->transactionLevel());
    }

    public function test_a_command_dispatched_by_a_handler_joins_the_open_transaction(): void
    {
        $this->installCommandModules();
        $this->journal->actAsUserId(TestIds::of(1));

        $id = $this->app->make(CommandBus::class)->run(new CopyNoteCommand('copied'));

        $this->assertSame('copied', $this->rowText($id));
    }

    public function test_a_refusal_rolls_back_everything_the_command_wrote(): void
    {
        $this->installCommandModules();
        $this->journal->actAsUserId(TestIds::of(1));

        try {
            $this->app->make(CommandBus::class)->run(new RefuseNoteCommand('gone'));
            $this->fail('The refusal did not reach the caller.');
        } catch (CommandRefused) {
            $this->assertSame(0, $this->rowCount());
        }
    }

    public function test_a_handler_that_ignores_a_failed_inner_command_fails_the_whole_command(): void
    {
        $this->installCommandModules();
        $this->journal->actAsUserId(TestIds::of(1));

        try {
            $this->app->make(CommandBus::class)->run(new IgnoreFailedNoteCommand('half'));
            $this->fail('The ignored failure was let through.');
        } catch (NestedCommandFailureIgnored) {
            $this->assertSame(0, $this->rowCount());
        }
    }

    public function test_a_transaction_a_handler_opens_itself_is_refused_and_nothing_is_left_open(): void
    {
        $this->installCommandModules();
        $this->journal->actAsUserId(TestIds::of(1));

        try {
            $this->app->make(CommandBus::class)->run(new OpenTransactionNoteCommand('own'));
            $this->fail('The explicit transaction was let through.');
        } catch (ExplicitTransactionInCommand) {
            $this->assertSame(0, $this->app->make(ConnectionInterface::class)->transactionLevel());
            $this->assertSame(0, $this->rowCount());
        }
    }

    public function test_a_command_joins_a_stack_transaction_of_its_isolation_and_refuses_another(): void
    {
        $this->installCommandModules();
        $this->journal->actAsUserId(TestIds::of(1));
        $bus = $this->app->make(CommandBus::class);

        $id = $this->app->make(StackTransaction::class)->run(fn () => $bus->run(new WriteNoteCommand('joined')));
        $this->assertSame('joined', $this->rowText($id));

        $this->expectException(CommandTransactionMismatch::class);
        $this->app->make(StackTransaction::class)->run(fn () => $bus->run(new PinNoteCommand($id)));
    }

    public function test_a_plain_dispatch_inside_a_committed_command_is_heard_after_the_commit(): void
    {
        $this->prepareCommandEventsAfterCommit();
        $levelOutside = $this->app->make(ConnectionInterface::class)->transactionLevel();

        $this->app->make(CommandBus::class)->run(new AuditNoteCommand('heard'));

        $this->assertSame([$levelOutside], $this->heardAt);
        $this->assertSame(1, $this->rowCount());
    }

    public function test_a_plain_dispatch_inside_a_rolled_back_command_is_never_heard(): void
    {
        $this->prepareCommandEventsAfterCommit();
        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new AuditNoteCommand('dropped', fails: true)),
            NoteWorkFailed::class,
        );

        $this->assertSame([], $this->heardAt);
        $this->assertSame(0, $this->rowCount());
    }

    public function test_a_dispatch_outside_any_command_is_heard_at_once(): void
    {
        $this->prepareCommandEventsAfterCommit();
        $this->app->make(Dispatcher::class)->dispatch(new NoteAudited());

        $this->assertCount(1, $this->heardAt);
    }

    public function test_a_listener_receives_the_fact_only_once_another_connection_reads_the_committed_row(): void
    {
        $this->preparePublication();
        $row = new RaisingRow();
        $row->name = 'start';
        $row->save();
        $database = $this->app->make(DatabaseManager::class);
        $this->app->make('config')->set('database.connections.second', $database->connection()->getConfig());
        $read = [];
        $this->app->make(Dispatcher::class)->listen(RowRenamed::class, function () use ($database, $row, &$read): void {
            $read[] = $database->connection('second')->table('raising_rows')->where('id', $row->id)->value('name');
        });

        $this->commit(fn () => $row->rename('committed'));
        $database->purge('second');

        $this->assertSame(['committed'], $read);
    }

    public function test_a_queued_listener_is_pushed_only_after_the_commit_and_a_rollback_sends_nothing(): void
    {
        $this->preparePublication();
        Queue::fake();
        $this->app->make(Dispatcher::class)->listen(RowRenamed::class, QueuedRenameListener::class);
        $row = new RaisingRow();
        $row->name = 'start';
        $row->save();
        $pushedBeforeCommit = 0;

        $this->commit(function () use ($row, &$pushedBeforeCommit): void {
            $row->rename('queued');
            $pushedBeforeCommit = count(Queue::pushed(CallQueuedListener::class));
        });
        $this->assertThrows(fn () => $this->commit(function () use ($row): void {
            $row->rename('rolled back');

            throw new RuntimeException('the command failed');
        }), RuntimeException::class);

        $this->assertSame(0, $pushedBeforeCommit);
        Queue::assertPushed(CallQueuedListener::class, 1);
    }

    // A failure is never swallowed. Every fact still goes out, then the failure is thrown.
    public function test_a_failing_listener_is_thrown_once_the_next_fact_went_out_too(): void
    {
        $this->preparePublication();
        $first = new RaisingRow();
        $first->name = 'a';
        $first->save();
        $second = new RaisingRow();
        $second->name = 'b';
        $second->save();
        $heard = [];
        $listener = function (RowRenamed $renamed) use (&$heard): void {
            $heard[] = $renamed->name;

            if ($renamed->name === 'failing') {
                throw new RuntimeException('the broadcaster failed');
            }
        };
        $this->app->make(Dispatcher::class)->listen(RowRenamed::class, $listener);

        $commit = fn () => $this->commit(function () use ($first, $second): void {
            $first->rename('failing');
            $second->rename('next');
        });

        $this->assertThrows($commit, CommittedFactListenerFailed::class);
        $this->assertSame(['failing', 'next'], $heard);
        $this->assertSame('failing', $first->refresh()->name);
    }

    public function test_a_fake_of_the_event_sees_it_after_the_commit(): void
    {
        $this->preparePublication();
        Event::fake([RowRenamed::class]);
        $row = new RaisingRow();
        $row->name = 'start';
        $row->save();

        $this->commit(fn () => $row->rename('faked'));

        Event::assertDispatched(RowRenamed::class, fn (RowRenamed $renamed) => $renamed->name === 'faked');
    }

    private function commit(callable $work): void
    {
        $database = $this->app->make(ConnectionInterface::class);
        $database->beginTransaction();
        $this->app->make(EventUnitLifecycle::class)->run(
            $database,
            'the test',
            $work(...),
            fn () => $database->commit(),
            fn () => $database->rollBack(),
        );
    }

    public function test_a_held_fact_is_drained_at_exit_after_the_work_done_inside(): void
    {
        $this->prepareEventHold();
        [$held, $inner] = [$this->row(), $this->row()];

        $unit = $this->owned(fn () => $this->lifecycle()->holdUntilReturn(function () use ($held, $inner): void {
            $held->rename('held');
            $this->lifecycle()->within($this->database(), fn () => $inner->rename('first'));
        }));

        $this->assertEquals(
            [new RowRenamed($inner->id, 'first'), new RowNoted($inner->id), new RowRenamed($held->id, 'held')],
            $unit->batch(),
        );
    }

    public function test_a_throw_drops_the_held_fact(): void
    {
        $this->prepareEventHold();
        $held = $this->row();
        $caught = '';

        $unit = $this->owned(function () use ($held, &$caught): void {
            try {
                $this->lifecycle()->holdUntilReturn(function () use ($held): void {
                    $held->rename('held');

                    throw new RuntimeException(self::FAILURE);
                });
            } catch (RuntimeException $failure) {
                $caught = $failure->getMessage();
            }
        });

        $this->assertSame(self::FAILURE, $caught);
        $this->assertSame([], $unit->batch());
    }

    public function test_a_nested_scope_or_a_barrier_does_not_release_the_held_fact(): void
    {
        $this->prepareEventHold();
        $held = $this->row();
        $seen = [];

        $unit = $this->owned(fn () => $this->lifecycle()->holdUntilReturn(function () use ($held, &$seen): void {
            $held->rename('held');
            $this->lifecycle()->holdUntilReturn(fn () => null);
            $this->app->make(TransactionListenerDrain::class)->runTransactionListeners($this->activeUnit());
            $seen = $this->activeUnit()->batch();
        }));

        $this->assertSame([], $seen);
        $this->assertEquals([new RowRenamed($held->id, 'held')], $unit->batch());
    }

    public function test_a_retry_raises_the_held_fact_once(): void
    {
        $this->prepareEventHold();
        $held = $this->row();
        $attempt = fn (bool $fails) => $this->owned(function () use ($held, $fails): void {
            $this->lifecycle()->holdUntilReturn(fn () => $held->rename('held'));

            if ($fails) {
                throw new RuntimeException('serialization failure');
            }
        });

        $this->assertThrows(fn () => $attempt(true), RuntimeException::class);
        $held->refresh();
        $unit = $attempt(false);

        $this->assertEquals([new RowRenamed($held->id, 'held')], $unit->batch());
    }

    public function test_a_siblings_facts_are_left_as_they_are(): void
    {
        $this->prepareEventHold();
        [$sibling, $held] = [$this->row(), $this->row()];

        $unit = $this->owned(function () use ($sibling, $held): void {
            $this->lifecycle()->within($this->database(), fn () => $sibling->rename('sibling'));
            $this->lifecycle()->holdUntilReturn(fn () => $held->rename('held'));
        });

        $this->assertEquals(
            [new RowRenamed($sibling->id, 'sibling'), new RowRenamed($held->id, 'held')],
            $unit->batch(),
        );
    }

    private function row(): RaisingRow
    {
        $raisingRow = new RaisingRow();
        $raisingRow->name = 'start';
        $raisingRow->save();

        return $raisingRow;
    }

    /**
     * @param  callable(): mixed  $work
     */
    private function owned(callable $work): EventUnit
    {
        $unit = null;
        $this->database()->beginTransaction();
        $this->lifecycle()->run(
            $this->database(),
            'the test',
            function () use ($work, &$unit): void {
                $unit = $this->activeUnit();
                $work();
            },
            fn () => $this->database()->commit(),
            fn () => $this->database()->rollBack(),
        );

        return $unit ?? throw new RuntimeException('No unit was open.');
    }

    private function lifecycle(): EventUnitLifecycle
    {
        return $this->app->make(EventUnitLifecycle::class);
    }

    private function database(): ConnectionInterface
    {
        return $this->app->make(ConnectionInterface::class);
    }

    private function activeUnit(): EventUnit
    {
        return $this->app->make(ActiveEventUnits::class)->activeFor($this->database())
            ->getOrThrow(new RuntimeException('No unit is active.'));
    }

    public function test_saves_of_a_b_a_yield_their_facts_in_save_order(): void
    {
        $this->prepareEventUnit();
        $unit = $this->openUnit();
        [$first, $second] = [new RaisingRow(), new RaisingRow()];

        $first->rename('x');
        $second->rename('y');
        $first->rename('z');
        $this->drain($unit, []);

        $this->assertEquals(
            [new RowRenamed($first->id, 'x'), new RowRenamed($second->id, 'y'), new RowRenamed($first->id, 'z')],
            $unit->batch(),
        );
    }

    public function test_a_selectively_faked_business_event_leaves_the_capture_on(): void
    {
        $this->prepareEventUnit();
        Event::fake([RowRenamed::class]);
        $unit = $this->openUnit();
        $row = new RaisingRow();

        $row->rename('x');
        $this->drain($unit, []);

        $this->assertEquals([new RowRenamed($row->id, 'x')], $unit->batch());
    }

    public function test_many_saves_without_facts_hold_only_the_row_saved_last(): void
    {
        $this->prepareEventUnit();
        $unit = new EventUnit();
        $earlier = new RaisingRow();
        $watched = WeakReference::create($earlier);
        $unit->openSlot($earlier);

        for ($save = 0; $save < 10_000; $save++) {
            $unit->openSlot(new RaisingRow());
        }

        unset($earlier);
        $unit->seal();

        $this->assertNull($watched->get());
        $this->assertFalse($unit->hasPending());
    }

    public function test_a_transaction_listener_runs_on_drain_and_its_fact_follows_its_siblings(): void
    {
        $this->prepareEventUnit();
        $unit = $this->openUnit();
        [$first, $second] = [new RaisingRow(), new RaisingRow()];

        $first->rename('first');
        $second->rename('second');
        $this->drain($unit, [RowRenamed::class => [NotesFirstRename::class.'@handle']]);

        $this->assertEquals(
            [new RowRenamed($first->id, 'first'), new RowRenamed($second->id, 'second'), new RowNoted($first->id)],
            $unit->batch(),
        );
    }

    public function test_a_loop_of_transaction_listeners_stops_at_the_limit_naming_the_chain(): void
    {
        $this->prepareEventUnit();
        $unit = $this->openUnit();
        new RaisingRow()->rename('again');
        $chain = array_fill(0, TransactionListenerDrain::CAUSAL_DEPTH_LIMIT + 1, RowRenamed::class);

        $this->expectExceptionObject(CausalDepthExceeded::along($chain, TransactionListenerDrain::CAUSAL_DEPTH_LIMIT));

        try {
            $this->drain($unit, [RowRenamed::class => [RenamesAgain::class.'@handle']]);
        } finally {
            $this->assertTrue($unit->hasFailed());
        }
    }

    public function test_only_a_model_that_raises_events_registers_the_capture(): void
    {
        $this->prepareEventUnit();
        new RaisingRow();
        new OwnRowWriter();
        $dispatcher = Model::getEventDispatcher();

        $this->assertTrue($dispatcher?->hasListeners('eloquent.saved: '.RaisingRow::class));
        $this->assertFalse($dispatcher?->hasListeners('eloquent.saved: '.OwnRowWriter::class));
    }

    private function openUnit(): EventUnit
    {
        return $this->app->make(ActiveEventUnits::class)->open(new RaisingRow()->getConnection());
    }

    /**
     * @param  array<string, list<string>>  $required
     */
    private function drain(EventUnit $unit, array $required): void
    {
        $drain = new TransactionListenerDrain(new ListenerRegistry($required), $this->app);
        $drain->runTransactionListeners($unit);
    }

    public function test_an_inner_commands_required_work_is_done_when_it_returns(): void
    {
        $this->prepareEventUnitLifecycle();
        $row = new RaisingRow();
        $row->name = 'start';
        $row->save();
        $seen = [];

        $unit = $this->ownedEventUnitLifecycle(function () use ($row, &$seen): void {
            $this->within(fn () => $row->rename('first'));
            $seen = $this->activeUnitEventUnitLifecycle()->batch();
        });

        $this->assertEquals([new RowRenamed($row->id, 'first'), new RowNoted($row->id)], $seen);
        $this->assertTrue($unit->isReady());
    }

    public function test_a_caught_failure_of_an_inner_command_refuses_the_commit_with_no_facts(): void
    {
        $this->prepareEventUnitLifecycle();
        $row = new RaisingRow();
        $row->name = 'start';
        $row->save();
        $unit = null;
        $caught = '';
        $commit = function () use ($row, &$unit, &$caught): void {
            $this->ownedEventUnitLifecycle(function () use ($row, &$unit, &$caught): void {
                $unit = $this->activeUnitEventUnitLifecycle();
                $row->rename('second');

                try {
                    $this->within(fn () => throw new RuntimeException(self::INNER_FAILURE));
                } catch (RuntimeException $failure) {
                    $caught = $failure->getMessage();
                }
            });
        };

        $this->assertThrows($commit, EventUnitRefused::class);
        $this->assertSame(self::INNER_FAILURE, $caught);
        $this->assertSame([], $unit?->batch());
        $this->assertSame('start', $row->refresh()->name);
    }

    public function test_a_stack_that_throws_after_a_command_rolls_both_back_and_the_next_stack_starts_empty(): void
    {
        $this->prepareEventUnitLifecycle();
        $row = new RaisingRow();
        $row->name = 'start';
        $row->save();
        $stack = $this->app->make(StackTransaction::class);

        $this->assertThrows(fn () => $stack->run(function () use ($row): void {
            $this->within(fn () => $row->rename('second'));

            throw new RuntimeException('the stack failed');
        }), RuntimeException::class);
        $next = $stack->run(fn () => $this->activeUnitEventUnitLifecycle()->batch());

        $this->assertSame('start', $row->refresh()->name);
        $this->assertSame([], $row->takeRaisedEvents());
        $this->assertSame([], $next);
    }

    public function test_a_retried_attempt_keeps_only_the_facts_of_the_attempt_that_commits(): void
    {
        $this->prepareEventUnitLifecycle();
        $row = new RaisingRow();
        $row->name = 'start';
        $row->save();

        $this->assertThrows(fn () => $this->ownedEventUnitLifecycle(function () use ($row): void {
            $row->rename('second');

            throw new RuntimeException('serialization failure');
        }), RuntimeException::class);
        $row->refresh();
        $kept = [];
        $this->ownedEventUnitLifecycle(function () use ($row, &$kept): void {
            $row->rename('third');
            $kept = $this->activeUnitEventUnitLifecycle();
        });

        $this->assertEquals([new RowRenamed($row->id, 'third')], $kept instanceof EventUnit ? $kept->batch() : []);
    }

    /**
     * Runs the work as the transaction owner would, and answers the unit it ran in.
     *
     * @param  callable(): void  $work
     */
    private function ownedEventUnitLifecycle(callable $work): EventUnit
    {
        $database = $this->app->make(ConnectionInterface::class);
        $unit = null;
        $database->beginTransaction();
        $this->app->make(EventUnitLifecycle::class)->run(
            $database,
            'the test',
            function () use ($work, &$unit): void {
                $unit = $this->activeUnitEventUnitLifecycle();
                $work();
            },
            fn () => $database->commit(),
            fn () => $database->rollBack(),
        );

        return $unit ?? throw new RuntimeException('No unit was open.');
    }

    private function within(callable $work): void
    {
        $this->app->make(EventUnitLifecycle::class)->within($this->app->make(ConnectionInterface::class), $work(...));
    }

    private function activeUnitEventUnitLifecycle(): EventUnit
    {
        return $this->app->make(ActiveEventUnits::class)->activeFor($this->app->make(ConnectionInterface::class))
            ->getOrThrow(new RuntimeException('No unit is active.'));
    }

    public function test_a_bare_save_fails_naming_the_model_when_writes_outside_commands_are_not_allowed(): void
    {
        $this->prepareRaisedOutsideUnit();
        $this->app->make(OutsideCommandAllowance::class)->forbid();

        $this->expectExceptionObject(RaisedOutsideUnit::for(RaisingRow::class));

        new RaisingRow()->rename('bare');
    }

    public function test_a_save_inside_a_unit_passes(): void
    {
        $this->prepareRaisedOutsideUnit();
        $this->app->make(OutsideCommandAllowance::class)->forbid();
        $row = new RaisingRow();
        $this->app->make(ActiveEventUnits::class)->open($row->getConnection());

        $row->rename('inside');

        $this->assertTrue($row->exists);
    }

    public function test_in_the_tests_a_bare_save_keeps_its_fact_on_the_instance(): void
    {
        $this->prepareRaisedOutsideUnit();
        $row = new RaisingRow();

        $row->rename('seeded');

        $this->assertEquals([new RowRenamed($row->id, 'seeded')], $row->takeRaisedEvents());
    }

    public function test_the_transaction_listener_runs_inside_and_the_public_facts_go_out_when_it_returns(): void
    {
        $this->prepareWrapperOwnedUnit();
        $row = new RaisingRow();
        $row->name = 'start';
        $row->save();
        $heardInside = null;

        $this->command(function () use ($row, &$heardInside): void {
            $row->rename('first');
            $heardInside = $this->heard;
        });

        $this->assertSame([], $heardInside);
        $this->assertSame(['renamed first', 'noted'], $this->heard);
    }

    public function test_a_command_that_throws_sends_no_facts(): void
    {
        $this->prepareWrapperOwnedUnit();
        $row = new RaisingRow();
        $row->name = 'start';
        $row->save();

        $this->assertThrows(fn () => $this->command(function () use ($row): void {
            $row->rename('first');

            throw new RuntimeException('the command failed');
        }), RuntimeException::class);

        $this->assertSame([], $this->heard);
    }

    /**
     * Runs the work as a command's handler would, through the transaction step, the nesting and the release.
     *
     * @param  callable(): void  $work
     */
    private function command(callable $work): void
    {
        $call = CommandCall::of(new StartTaskCommand('task'), 'Tasks', true, false, null);
        $nesting = $this->app->make(CommandNesting::class);
        $nesting->enter(StartTaskCommand::class);

        try {
            $this->app->make(RunInTransaction::class)->handle($call, function () use ($work): null {
                $work();

                return null;
            });
        } finally {
            $nesting->leave();
            $this->app->make(Publication::class)->release();
        }
    }

    public function test_an_insert_if_absent_opens_one_slot_when_it_inserts_and_none_when_the_row_exists(): void
    {
        $this->prepareCaptureSafeWrites();
        $unit = $this->openUnit();

        $inserted = RaisingRow::claimOnce(7, 'first');
        $repeated = RaisingRow::claimOnce(7, 'second');
        $this->drainCaptureSafeWrites($unit);

        $this->assertTrue($inserted->exists);
        $this->assertSame([], $repeated->takeRaisedEvents());
        $this->assertEquals([new RowRenamed(7, 'first')], $unit->batch());
        $this->assertSame('first', RaisingRow::query()->findOrFail(7)->name);
    }

    public function test_a_counter_changed_and_saved_is_captured(): void
    {
        $this->prepareCaptureSafeWrites();
        $row = new RaisingRow();
        $row->name = 'counted';
        $row->save();
        $unit = $this->openUnit();

        $row->countVisit();
        $this->drainCaptureSafeWrites($unit);

        $this->assertSame(1, $row->refresh()->times);
        $this->assertEquals([new RowRenamed($row->id, 'counted')], $unit->batch());
    }

    private function drainCaptureSafeWrites(EventUnit $unit): void
    {
        new TransactionListenerDrain(new ListenerRegistry(), $this->app)->runTransactionListeners($unit);
    }

    /**
     * The setup the CommandEventsAfterCommit cases share.
     */
    private function prepareCommandEventsAfterCommit(): void
    {
        $this->installCommandModules();
        $this->journal->actAsUserId(TestIds::of(1));
        $database = $this->app->make(ConnectionInterface::class);
        $this->app->make(Dispatcher::class)->listen(
            NoteAudited::class,
            function () use ($database): void {
                $this->heardAt[] = $database->transactionLevel();
            },
        );
    }

    /**
     * The setup the Publication cases share.
     */
    private function preparePublication(): void
    {
        $this->createRaisingRows();
        $this->app->instance(ListenerRegistry::class, new ListenerRegistry());
    }

    /**
     * The setup the EventHold cases share.
     */
    private function prepareEventHold(): void
    {
        $this->createRaisingRows();
        $required = [RowRenamed::class => [NotesFirstRename::class.'@handle']];
        $this->app->instance(ListenerRegistry::class, new ListenerRegistry($required));
    }

    /**
     * The setup the EventUnit cases share.
     */
    private function prepareEventUnit(): void
    {
        $this->createRaisingRows();
    }

    /**
     * The setup the EventUnitLifecycle cases share.
     */
    private function prepareEventUnitLifecycle(): void
    {
        $this->createRaisingRows();
        $required = [RowRenamed::class => [NotesFirstRename::class.'@handle']];
        $this->app->instance(ListenerRegistry::class, new ListenerRegistry($required));
    }

    /**
     * The setup the RaisedOutsideUnit cases share.
     */
    private function prepareRaisedOutsideUnit(): void
    {
        $this->createRaisingRows();
    }

    /**
     * The setup the WrapperOwnedUnit cases share.
     */
    private function prepareWrapperOwnedUnit(): void
    {
        $this->createRaisingRows();
        $required = [RowRenamed::class => [NotesFirstRename::class.'@handle']];
        $this->app->instance(ListenerRegistry::class, new ListenerRegistry($required));
        $dispatcher = $this->app->make(Dispatcher::class);
        $dispatcher->listen(RowRenamed::class, fn (RowRenamed $renamed) => $this->heard[] = "renamed {$renamed->name}");
        $dispatcher->listen(RowNoted::class, fn () => $this->heard[] = 'noted');
    }

    /**
     * The setup the CaptureSafeWrites cases share.
     */
    private function prepareCaptureSafeWrites(): void
    {
        $this->createRaisingRows();
    }

    /**
     * The table the raising fixture models write, with the counter one of them keeps, made fresh for the test and
     * dropped when it ends, since these tests commit.
     */
    private function createRaisingRows(): void
    {
        Schema::dropIfExists('raising_rows');
        Schema::create('raising_rows', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->integer('times')->default(0);
            $table->timestamps();
        });
        $this->beforeApplicationDestroyed(fn () => Schema::dropIfExists('raising_rows'));
    }
}
