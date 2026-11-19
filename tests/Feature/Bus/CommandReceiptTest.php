<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Assignments\Commands\AssignRecord;
use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Support\AssigneeIdentity;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\OperationResolver;
use App\Bus\Enums\ReceiptState;
use App\Bus\Exceptions\CommandRefused;
use App\Bus\Exceptions\NestedCommandFailureIgnored;
use App\Bus\Exceptions\OperationUnavailable;
use App\Bus\Exceptions\RefusalReplayed;
use App\Bus\Exceptions\RequestKeyConflict;
use App\Bus\Support\RequestKey;
use Domain\Tasks\Models\Task;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Fixtures\Modules\Notes\Commands\IgnoreFailedNote;
use Tests\Fixtures\Modules\Notes\Commands\RefuseNote;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote;

/**
 * A keyed write of an agent session runs once: a repeat answers from its receipt without the handler, a different
 * write under the key is a conflict, a refusal is kept and given again, and a rolled-back write leaves the key free.
 */
final class CommandReceiptTest extends CommandBusTestCase
{
    private const string KEY = '01JD8X0G9M3QZ6V4K2RECEIPT1';

    private TestLaunch $launch;

    protected function setUp(): void
    {
        parent::setUp();

        $this->installCommandModules();
        $this->launch = TestLaunch::start();
        $this->startRequestAs($this->launch->agent->id, $this->launch->session->id);
        $this->app->make(RequestKey::class)->set(self::KEY);
    }

    protected function tearDown(): void
    {
        $database = $this->app->make(ConnectionInterface::class);

        foreach ([
            'command_receipts',
            'assignments',
            'tasks',
            'launch_credentials',
            'agent_sessions',
            'agents',
        ] as $table) {
            $database->table($table)->delete();
        }

        parent::tearDown();
    }

    public function test_the_receipts_table_is_migrated(): void
    {
        $this->assertTrue(Schema::hasTable('command_receipts'));
    }

    public function test_a_write_with_a_key_runs_once_and_a_repeat_returns_its_result_without_the_handler(): void
    {
        $bus = $this->app->make(CommandBus::class);

        $first = $bus->run(new WriteNote('once'));
        $repeat = $bus->run(new WriteNote('once'));

        $this->assertSame($first, $repeat);
        $this->assertSame(1, $this->rowCount());
        $this->assertSame(
            ReceiptState::Completed,
            $this->app->make(OperationResolver::class)->operation(self::KEY)->state,
        );
    }

    public function test_a_changed_body_under_the_same_key_is_a_request_key_conflict(): void
    {
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new WriteNote('first'));

        $this->assertThrows(fn () => $bus->run(new WriteNote('changed')), RequestKeyConflict::class);
        $this->assertSame(1, $this->rowCount());
    }

    public function test_a_refused_write_keeps_its_refusal_and_a_retry_gets_the_same_one(): void
    {
        $bus = $this->app->make(CommandBus::class);

        try {
            $bus->run(new RefuseNote('refused'));
            $this->fail('The write was not refused.');
        } catch (CommandRefused $refusal) {
            $message = $refusal->getMessage();
        }

        $this->assertThrows(fn () => $bus->run(new RefuseNote('refused')), RefusalReplayed::class, $message);
        $this->assertSame(
            ReceiptState::Refused,
            $this->app->make(OperationResolver::class)->operation(self::KEY)->state,
        );
        $this->assertSame(0, $this->rowCount());
    }

    public function test_a_rolled_back_write_leaves_no_receipt_so_the_key_is_safe_to_retry(): void
    {
        $bus = $this->app->make(CommandBus::class);

        $this->assertThrows(
            fn () => $bus->run(new IgnoreFailedNote('rolled back')),
            NestedCommandFailureIgnored::class,
        );

        $this->assertThrows(
            fn () => $this->app->make(OperationResolver::class)->operation(self::KEY),
            OperationUnavailable::class,
        );
        $id = $bus->run(new WriteNote('retried'));
        $this->assertSame('retried', $this->rowText($id));
    }

    public function test_a_repeatable_read_assignment_is_receipted_and_replayed(): void
    {
        $task = Task::factory()->create(['title' => 'Keyed']);
        $bus = $this->app->make(CommandBus::class);
        $command = new AssignRecord($task->assignmentIdentity(), AssigneeIdentity::of($this->launch->agent));

        $first = $bus->run($command);
        $repeat = $bus->run($command);

        $this->assertEquals($first, $repeat);
        $this->assertSame(1, AssignmentRecord::query()->count());
    }
}
