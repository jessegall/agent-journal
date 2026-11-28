<?php

declare(strict_types=1);

namespace Tests\Middleware;

use App\Access\Exceptions\StackLockTimedOut;
use App\Access\StackAdmission;
use App\Bus\CommandMiddleware\AdmitStack;
use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandRefused;
use App\Support\StackOperationDeadline;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\DatabaseManager;
use Tests\Fixtures\Modules\Notes\Commands\CopyNote\CopyNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\RefuseNote\RefuseNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote\WriteNoteCommand;
use Tests\Support\Bus\RunsModuleCommands;
use Tests\Support\Entries\Attributes\TestsMiddleware;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Commands of one agent session pass its stack one at a time: AdmitStack takes the session's advisory lock before
 * the transaction, another session is never held up, a nested command joins, and the lock is given back however
 * the command ends.
 */
#[TestsMiddleware(AdmitStack::class)]
final class AdmitStackTest extends TestCase
{
    use RunsModuleCommands;

    /**
     * None at the start: the test modules' table is made as a test sets up and emptied when it ends.
     */
    private const array TABLES = [];

    private const string BUSY = 'busy with another operation';

    private const string OTHER_SESSION = 'other session';

    private ConnectionInterface $holder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->installCommandModules();
        $this->app->instance(StackOperationDeadline::class, new StackOperationDeadline(300));
        $databases = $this->app->make(DatabaseManager::class);
        $this->holder = $databases->connectUsing(
            'stack-holder',
            $this->app->make('config')->array('database.connections.'.$databases->getDefaultConnection()),
            true,
        );
    }

    protected function tearDown(): void
    {
        $this->holder->select('SELECT pg_advisory_unlock_all()');
        $this->app->make(DatabaseManager::class)->disconnect('stack-holder');

        parent::tearDown();
    }

    public function test_a_command_waits_for_its_sessions_stack_and_is_refused_busy_without_spending_retries(): void
    {
        $this->hold(2);
        $this->journal->actAsAgentIds(TestIds::of(1), TestIds::of(2));

        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new WriteNoteCommand('waits')),
            StackLockTimedOut::class,
            self::BUSY,
        );
        $this->assertSame(0, $this->rowCount());
    }

    public function test_the_next_command_of_the_session_runs_once_the_stack_is_given_back(): void
    {
        $this->hold(2);
        $this->holder->select(
            'SELECT pg_advisory_unlock(?, hashtext(?))',
            [StackAdmission::FIRST_LOCK_KEY, TestIds::of(2)],
        );
        $this->journal->actAsAgentIds(TestIds::of(1), TestIds::of(2));

        $id = $this->app->make(CommandBus::class)->run(new WriteNoteCommand('after'));

        $this->assertSame('after', $this->rowText($id));
    }

    public function test_a_command_of_another_session_is_not_held_up(): void
    {
        $this->hold(2);
        $this->journal->actAsAgentIds(TestIds::of(1), TestIds::of(3));

        $id = $this->app->make(CommandBus::class)->run(new WriteNoteCommand(self::OTHER_SESSION));

        $this->assertSame(self::OTHER_SESSION, $this->rowText($id));
    }

    public function test_a_nested_command_joins_the_outer_admission(): void
    {
        $this->journal->actAsAgentIds(TestIds::of(1), TestIds::of(2));

        $id = $this->app->make(CommandBus::class)->run(new CopyNoteCommand('nested'));

        $this->assertSame('nested', $this->rowText($id));
        $this->assertTrue($this->canTake(2));
    }

    public function test_the_stack_is_given_back_after_a_thrown_handler(): void
    {
        $this->journal->actAsAgentIds(TestIds::of(1), TestIds::of(2));

        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new RefuseNoteCommand('refused')),
            CommandRefused::class,
        );

        $this->assertTrue($this->canTake(2));
    }

    public function test_a_user_command_takes_no_stack_lock(): void
    {
        $this->hold(2);
        $this->journal->actAsUserId(TestIds::of(4));

        $id = $this->app->make(CommandBus::class)->run(new WriteNoteCommand('user'));

        $this->assertSame('user', $this->rowText($id));
    }

    private function hold(int $sessionIdNumber): void
    {
        $sessionId = TestIds::of($sessionIdNumber);
        $this->holder->select(
            'SELECT pg_advisory_lock(?, hashtext(?))',
            [StackAdmission::FIRST_LOCK_KEY, $sessionId],
        );
    }

    private function canTake(int $sessionIdNumber): bool
    {
        $sessionId = TestIds::of($sessionIdNumber);
        $taken = $this->holder->selectOne(
            'SELECT pg_try_advisory_lock(?, hashtext(?)) AS taken',
            [StackAdmission::FIRST_LOCK_KEY, $sessionId],
        )->taken;
        $this->holder->select('SELECT pg_advisory_unlock_all()');

        return $taken === true;
    }
}
