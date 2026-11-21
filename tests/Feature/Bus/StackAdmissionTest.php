<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandRefused;
use App\Bus\Exceptions\StackLockTimedOut;
use App\Bus\Support\OperationDeadline;
use App\Hooks\Admission\AdvisoryStackAdmission;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\DatabaseManager;
use Tests\Fixtures\Modules\Notes\Commands\CopyNote;
use Tests\Fixtures\Modules\Notes\Commands\RefuseNote;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote;
use Tests\Support\TestIds;

/**
 * Commands of one agent session pass its stack one at a time: AdmitStack takes the session's advisory lock before
 * the transaction, another session is never held up, a nested command joins, and the lock is given back however
 * the command ends.
 */
final class StackAdmissionTest extends CommandBusTestCase
{
    private ConnectionInterface $holder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->installCommandModules();
        $this->app->instance(OperationDeadline::class, new OperationDeadline(300));
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
        $this->startTestAgentRequest(1, 2);

        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new WriteNote('waits')),
            StackLockTimedOut::class,
            'busy with another operation',
        );
        $this->assertSame(0, $this->rowCount());
    }

    public function test_the_next_command_of_the_session_runs_once_the_stack_is_given_back(): void
    {
        $this->hold(2);
        $this->holder->select(
            'SELECT pg_advisory_unlock(?, hashtext(?))',
            [AdvisoryStackAdmission::NAMESPACE, TestIds::of(2)],
        );
        $this->startTestAgentRequest(1, 2);

        $id = $this->app->make(CommandBus::class)->run(new WriteNote('after'));

        $this->assertSame('after', $this->rowText($id));
    }

    public function test_a_command_of_another_session_is_not_held_up(): void
    {
        $this->hold(2);
        $this->startTestAgentRequest(1, 3);

        $id = $this->app->make(CommandBus::class)->run(new WriteNote('other session'));

        $this->assertSame('other session', $this->rowText($id));
    }

    public function test_a_nested_command_joins_the_outer_admission(): void
    {
        $this->startTestAgentRequest(1, 2);

        $id = $this->app->make(CommandBus::class)->run(new CopyNote('nested'));

        $this->assertSame('nested', $this->rowText($id));
        $this->assertTrue($this->canTake(2));
    }

    public function test_the_stack_is_given_back_after_a_thrown_handler(): void
    {
        $this->startTestAgentRequest(1, 2);

        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new RefuseNote('refused')),
            CommandRefused::class,
        );

        $this->assertTrue($this->canTake(2));
    }

    public function test_a_user_command_takes_no_stack_lock(): void
    {
        $this->hold(2);
        $this->startTestUserRequest(4);

        $id = $this->app->make(CommandBus::class)->run(new WriteNote('user'));

        $this->assertSame('user', $this->rowText($id));
    }

    private function hold(int $sessionIdNumber): void
    {
        $sessionId = TestIds::of($sessionIdNumber);
        $this->holder->select(
            'SELECT pg_advisory_lock(?, hashtext(?))',
            [AdvisoryStackAdmission::NAMESPACE, $sessionId],
        );
    }

    private function canTake(int $sessionIdNumber): bool
    {
        $sessionId = TestIds::of($sessionIdNumber);
        $taken = $this->holder->selectOne(
            'SELECT pg_try_advisory_lock(?, hashtext(?)) AS taken',
            [AdvisoryStackAdmission::NAMESPACE, $sessionId],
        )->taken;
        $this->holder->select('SELECT pg_advisory_unlock_all()');

        return $taken === true;
    }
}
