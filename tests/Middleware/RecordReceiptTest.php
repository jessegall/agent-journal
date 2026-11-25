<?php

declare(strict_types=1);

namespace Tests\Middleware;

use App\CommandMiddleware\RecordReceipt;
use App\Commands\Assignments\AssignRecord\AssignRecordCommand;
use App\Contracts\Authorization\OperationResolver;
use App\Contracts\Bus\CommandBus;
use App\Enums\CommandRules\ReceiptStatus;
use App\Exceptions\RequestKeyConflict;
use App\Exceptions\RequestKeyExpired;
use App\Exceptions\RequestKeyMissing;
use App\Http\Middleware\Web\ReadIdempotencyKey;
use App\Models\CommandRules\CommandReceipt;
use App\Models\Records\AssignmentRecord;
use App\Support\AssigneeIdentity;
use App\Support\RequestKey;
use Domain\Rules\RulesDomain;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Modules\Notes\Commands\KeepNote\KeepNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\RetainNote\RetainNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote\WriteNoteCommand;
use Tests\Support\Bus\RunsModuleCommands;
use Tests\Support\ClearsStartRows;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMiddleware;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A keyed write runs once and is receipted in its actor's key space: a repeat answers from the receipt without the
 * handler, a changed payload conflicts, another actor's same key is its own, a repeatable read is receipted and
 * replayed, a command that needs a key is refused without one, and a key past its retention is refused, then forgotten
 * after its tombstone.
 */
#[TestsMiddleware(RecordReceipt::class)]
final class RecordReceiptTest extends TestCase
{
    use ClearsStartRows;
    use RunsModuleCommands;

    /**
     * The tables these tests commit to, emptied around each test.
     */
    private const array TABLES = [];

    private const string KEY = '01JD8X0G9M3QZ6V4K2RECEIPT1';

    private const string KEY_RETAINEDREQUESTKEY = '01JD8X0G9M3QZ6V4K2RETAINED1';

    private const string KEY_OWNERRECEIPT = '01JD8X0G9M3QZ6V4K2OWNERKEY1';

    private TestStart $start;

    /**
     * The domains these tests use beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class, TasksDomain::class);
    }

    public function test_a_write_with_a_key_runs_once_and_a_repeat_returns_its_result_without_the_handler(): void
    {
        $this->prepareCommandReceipt();
        $bus = $this->app->make(CommandBus::class);

        $first = $bus->run(new WriteNoteCommand('once'));
        $repeat = $bus->run(new WriteNoteCommand('once'));

        $this->assertSame($first, $repeat);
        $this->assertSame(1, $this->rowCount());
        $this->assertSame(
            ReceiptStatus::Completed,
            $this->app->make(OperationResolver::class)->operation(self::KEY)->state,
        );
    }

    public function test_a_repeatable_read_assignment_is_receipted_and_replayed(): void
    {
        $this->prepareCommandReceipt();
        $task = Task::factory()->create(['title' => 'Keyed']);
        $bus = $this->app->make(CommandBus::class);
        $command = new AssignRecordCommand($task->assignmentIdentity(), AssigneeIdentity::of($this->start->agent));

        $first = $bus->run($command);
        $repeat = $bus->run($command);

        $this->assertEquals($first, $repeat);
        $this->assertSame(1, AssignmentRecord::query()->count());
    }

    public function test_another_session_of_the_same_actor_gets_the_same_answer(): void
    {
        $this->prepareRetainedRequestKey();
        $first = $this->retainAs(1, 10, 'once');
        $again = $this->retainAs(1, 11, 'once');

        $this->assertSame($first, $again);
        $rows = $this->app->make(ConnectionInterface::class)->table('module_command_rows')->where('text', 'once');
        $this->assertSame(1, $rows->count());
    }

    public function test_another_actor_with_the_same_key_runs_its_own_command(): void
    {
        $this->prepareRetainedRequestKey();
        $first = $this->retainAs(1, 10, 'mine');
        $other = $this->retainAs(2, 20, 'mine');

        $this->assertNotSame($first, $other);
    }

    public function test_a_changed_payload_under_the_key_conflicts(): void
    {
        $this->prepareRetainedRequestKey();
        $this->retainAs(1, 10, 'first');

        $this->expectException(RequestKeyConflict::class);

        $this->retainAs(1, 11, 'second');
    }

    public function test_after_30_days_the_key_is_refused_and_its_receipt_is_kept(): void
    {
        $this->prepareRetainedRequestKey();
        $this->retainAs(1, 10, 'old');
        $this->travel(31)->days();

        $this->assertThrows(fn () => $this->retainAs(1, 11, 'old'), RequestKeyExpired::class);
        $this->assertNull(CommandReceipt::query()->withoutGlobalScopes()->sole()->refuses_until);
    }

    public function test_a_call_without_a_key_is_refused(): void
    {
        $this->prepareRetainedRequestKey();
        $this->journal->actAsAgentIds(TestIds::of(1), TestIds::of(10));

        $this->expectException(RequestKeyMissing::class);

        $this->app->make(CommandBus::class)->run(new RetainNoteCommand('no key'));
    }

    private function retainAs(int $agentIdNumber, int $sessionIdNumber, string $text): int
    {
        $agentId = TestIds::of($agentIdNumber);
        $sessionId = TestIds::of($sessionIdNumber);
        $this->app->forgetScopedInstances();
        $this->journal->actAsAgentIds($agentId, $sessionId);
        $this->app->make(RequestKey::class)->set(self::KEY_RETAINEDREQUESTKEY);

        return $this->app->make(CommandBus::class)->run(new RetainNoteCommand($text));
    }

    public function test_an_owner_call_with_a_key_runs_once_and_its_repeat_returns_the_same_result(): void
    {
        $this->prepareOwnerReceipt();
        $this->app->make(RequestKey::class)->set(self::KEY_OWNERRECEIPT);
        $bus = $this->app->make(CommandBus::class);

        $first = $bus->run(new KeepNoteCommand('once'));
        $repeat = $bus->run(new KeepNoteCommand('once'));

        $this->assertSame($first, $repeat);
        $this->assertSame(1, $this->rowCount());
        $receipt = CommandReceipt::query()->sole();
        $this->assertSame('user', $receipt->author_type);
        $this->assertNull($receipt->session_id);
        $this->assertSame(KeepNoteCommand::class, $receipt->command);
    }

    public function test_a_changed_payload_under_the_same_key_conflicts(): void
    {
        $this->prepareOwnerReceipt();
        $this->app->make(RequestKey::class)->set(self::KEY_OWNERRECEIPT);
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new KeepNoteCommand('first'));

        $this->assertThrows(fn () => $bus->run(new KeepNoteCommand('changed')), RequestKeyConflict::class);
        $this->assertSame(1, $this->rowCount());
    }

    public function test_a_command_that_requires_a_key_is_refused_without_one(): void
    {
        $this->prepareOwnerReceipt();
        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new KeepNoteCommand('keyless')),
            RequestKeyMissing::class,
        );
        $this->assertSame(0, $this->rowCount());
        $this->assertSame(0, CommandReceipt::query()->count());
    }

    public function test_a_key_past_its_retention_is_refused_and_not_run_again(): void
    {
        $this->prepareOwnerReceipt();
        $this->app->make(RequestKey::class)->set(self::KEY_OWNERRECEIPT);
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new KeepNoteCommand('kept'));

        $this->travel(32)->days();

        $this->assertThrows(fn () => $bus->run(new KeepNoteCommand('kept')), RequestKeyExpired::class);
        $this->assertThrows(fn () => $bus->run(new KeepNoteCommand('another')), RequestKeyExpired::class);
        $this->assertSame(1, $this->rowCount());
    }

    public function test_the_prune_expires_a_receipt_past_its_retention_and_removes_it_past_its_removal_time(): void
    {
        $this->prepareOwnerReceipt();
        $this->app->make(RequestKey::class)->set(self::KEY_OWNERRECEIPT);
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new KeepNoteCommand('kept'));

        $this->travel(32)->days();
        $this->prune();

        $receipt = CommandReceipt::query()->sole();
        $this->assertSame(ReceiptStatus::Expired, $receipt->status);
        $this->assertNull($receipt->result);
        $this->assertThrows(fn () => $bus->run(new KeepNoteCommand('kept')), RequestKeyExpired::class);

        $this->travel(334)->days();
        $this->prune();

        $this->assertSame(0, CommandReceipt::query()->count());
    }

    public function test_a_receipt_without_a_declared_retention_is_removed_after_thirty_days(): void
    {
        $this->prepareOwnerReceipt();
        $this->app->make(RequestKey::class)->set(self::KEY_OWNERRECEIPT);
        $this->app->make(CommandBus::class)->run(new WriteNoteCommand('standard'));

        $this->travel(31)->days();
        $this->prune();

        $this->assertSame(0, CommandReceipt::query()->count());
    }

    public function test_the_same_key_of_a_user_and_an_agent_names_two_writes(): void
    {
        $this->prepareOwnerReceipt();
        $this->app->make(RequestKey::class)->set(self::KEY_OWNERRECEIPT);
        $this->app->make(CommandBus::class)->run(new WriteNoteCommand('user'));

        $start = $this->journal->signedStart('Main agent', 'main-agent');
        $this->journal->actAsAgentIds($start->agent->id, $start->session->id);
        $this->app->make(CommandBus::class)->run(new WriteNoteCommand('agent'));

        $this->assertSame(2, $this->rowCount());
        $this->assertSame(1, CommandReceipt::query()->count());
        $this->assertSame($start->session->id, CommandReceipt::query()->sole()->session_id);
    }

    public function test_the_idempotency_key_header_keys_the_request(): void
    {
        $this->prepareOwnerReceipt();
        $request = Request::create('/sharing', 'POST');
        $request->headers->set('Idempotency-Key', self::KEY_OWNERRECEIPT);

        $keys = $this->app->make(RequestKey::class);
        $seen = null;

        $this->app->make(ReadIdempotencyKey::class)->handle($request, function () use ($keys, &$seen): Response {
            $seen = $keys->key();

            return new Response();
        });

        $this->assertSame(self::KEY_OWNERRECEIPT, $seen);
        $this->assertNull($keys->key());
    }

    private function prune(): void
    {
        $this->assertSame(0, $this->app->make(Kernel::class)->call('bus:prune-receipts'));
    }

    /**
     * The setup the CommandReceipt cases share.
     */
    private function prepareCommandReceipt(): void
    {
        $this->installCommandModules();
        $this->start = $this->journal->signedStart('Main agent', 'main-agent');
        $this->journal->actAsAgentIds($this->start->agent->id, $this->start->session->id);
        $this->app->make(RequestKey::class)->set(self::KEY);
        $this->beforeApplicationDestroyed(function (): void {
            $database = $this->app->make(ConnectionInterface::class);

            foreach ([
                'command_receipts',
                'assignments',
                'tasks',
                'session_tokens',
                'agent_sessions',
                'agents',
            ] as $table) {
                $database->table($table)->delete();
            }
        });
    }

    /**
     * The setup the RetainedRequestKey cases share.
     */
    private function prepareRetainedRequestKey(): void
    {
        $this->installCommandModules();
        $this->beforeApplicationDestroyed(function (): void {
            $database = $this->app->make(ConnectionInterface::class);

            foreach (['command_receipts', 'module_command_rows'] as $table) {
                $database->table($table)->delete();
            }
        });
    }

    /**
     * The setup the OwnerReceipt cases share.
     */
    private function prepareOwnerReceipt(): void
    {
        $this->installCommandModules();
        $this->journal->actAsUserId(TestIds::of(1));
    }
}
