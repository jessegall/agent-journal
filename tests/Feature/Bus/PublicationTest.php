<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Support\EventUnitLifecycle;
use App\Support\ListenerRegistry;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\DatabaseManager;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Events\CallQueuedListener;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Schema;
use RuntimeException;
use Tests\Fixtures\Contracts\QueuedRenameListener;
use Tests\Fixtures\Contracts\RaisingRow;
use Tests\Fixtures\Contracts\RowRenamed;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * A committed unit's facts go out once, in order, through Laravel's dispatcher after the commit: a listener and a
 * queue see them only once another connection reads the row, a rollback sends nothing, a failing listener is logged
 * and the next fact still goes out, and a test's fake of the event sees it.
 */
final class PublicationTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [];

    protected function setUp(): void
    {
        parent::setUp();

        Schema::dropIfExists('raising_rows');
        Schema::create('raising_rows', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });
        $this->app->instance(ListenerRegistry::class, new ListenerRegistry());
    }

    protected function tearDown(): void
    {
        Schema::dropIfExists('raising_rows');

        parent::tearDown();
    }

    public function test_a_listener_hears_the_fact_only_once_another_connection_reads_the_committed_row(): void
    {
        $row = RaisingRow::query()->create(['name' => 'start']);
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
        Queue::fake();
        $this->app->make(Dispatcher::class)->listen(RowRenamed::class, QueuedRenameListener::class);
        $row = RaisingRow::query()->create(['name' => 'start']);
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

    public function test_a_failing_listener_is_logged_and_the_next_fact_still_goes_out(): void
    {
        Log::spy();
        $first = RaisingRow::query()->create(['name' => 'a']);
        $second = RaisingRow::query()->create(['name' => 'b']);
        $heard = [];
        $listener = function (RowRenamed $renamed) use (&$heard): void {
            $heard[] = $renamed->name;

            if ($renamed->name === 'failing') {
                throw new RuntimeException('the broadcaster failed');
            }
        };
        $this->app->make(Dispatcher::class)->listen(RowRenamed::class, $listener);

        $this->commit(function () use ($first, $second): void {
            $first->rename('failing');
            $second->rename('next');
        });

        $this->assertSame(['failing', 'next'], $heard);
        $this->assertSame('failing', $first->refresh()->name);
        Log::shouldHaveReceived('error')->once();
    }

    public function test_a_fake_of_the_event_sees_it_after_the_commit(): void
    {
        Event::fake([RowRenamed::class]);
        $row = RaisingRow::query()->create(['name' => 'start']);

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
}
