<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Enums\ContextStartType;
use App\Enums\RewriteSupport;
use App\Exceptions\StackLockTimedOut;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\HookCall;
use App\Support\Drivers\DriverCapabilities;
use App\Support\Drivers\DriverReplies;
use App\Support\Drivers\DriverReply;
use App\Support\Inputs\SessionStarted;
use App\Support\Inputs\Values\SessionStartDetails;
use App\Support\OperationDeadline;
use App\Support\Stack\HookAnswer;
use App\Support\Storage\WalkStep;
use App\Values\AgentText;
use Illuminate\Support\Facades\DB;
use Tests\Fixtures\Hooks\TestFailure;
use Tests\Support\CommittedHookStack;
use Tests\Support\TestActors;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

#[TimeLimit(seconds: 5, reason: 'It waits for a second process to release a stack lock.')]
final class HookTransactionTest extends TestCase
{
    use CommittedHookStack;

    private const string WAITING_THEN_COMMITTED = <<<'TEXT'
        saw the hook waiting
        committed

        TEXT;

    public function test_a_hook_waiting_on_a_held_stack_lock_times_out_and_keeps_nothing(): void
    {
        $config = $this->app->make('config');
        $config->set(
            'database.connections.hooks_holder',
            $config->get('database.connections.'.$config->get('database.default')),
        );
        $holder = DB::connection('hooks_holder');
        $holder->beginTransaction();
        $holder->table('agent_stacks')->lockForUpdate()->get();

        try {
            $this->machine()->answer(
                $this->stop(),
                $this->capabilities(),
                new OperationDeadline(300),
                fn (HookAnswer $answer) => DriverReplies::stop($answer),
            );
            $this->fail('The hook did not time out on the held lock.');
        } catch (StackLockTimedOut $timedOut) {
            $this->assertInstanceOf(StackLockTimedOut::class, $timedOut);
        } finally {
            $holder->rollBack();
            $holder->disconnect();
        }

        $this->assertSame(0, HookCall::query()->count());
    }

    public function test_a_hook_waits_for_a_push_another_process_holds_and_then_sees_it(): void
    {
        $process = $this->startLockHolder(taskNumber: 43);

        try {
            $this->waitForLine($process['stdout'], 'locked');

            $reply = $this->machine()->answer(
                $this->stop(),
                $this->capabilities(),
                new OperationDeadline(5000),
                fn (HookAnswer $answer) => DriverReplies::stop($answer),
            );
        } finally {
            $this->assertSame(self::WAITING_THEN_COMMITTED, stream_get_contents($process['stdout']));
            proc_close($process['handle']);
        }

        $this->assertStringContainsString(AgentText::of('tasks.unfinished', ['task' => 43])->text, $reply->stdout);
        $this->assertSame(['pushed-by-other-process deny'], array_map(
            fn (WalkStep $step) => "{$step->frameId} {$step->answer->value}",
            HookCall::query()->sole()->steps->steps,
        ));
    }

    /**
     * @return array{handle: resource, stdout: resource}
     */
    private function startLockHolder(int $taskNumber): array
    {
        $connection = $this->app->make('config')->get(
            'database.connections.'.$this->app->make('config')->get('database.default'),
        );
        $environment = [
            ...getenv(),
            'LOCK_DB_HOST' => (string) $connection['host'],
            'LOCK_DB_PORT' => (string) $connection['port'],
            'LOCK_DB_DATABASE' => (string) $connection['database'],
            'LOCK_DB_USERNAME' => (string) $connection['username'],
            'LOCK_DB_PASSWORD' => (string) $connection['password'],
            'LOCK_AGENT_ID' => (string) $this->target->agentId,
            'LOCK_SESSION_ID' => (string) $this->target->sessionId,
            'LOCK_TASK_NUMBER' => (string) $taskNumber,
        ];

        $handle = proc_open(
            [PHP_BINARY, base_path('tests/bin/hold-stack-lock.php')],
            [1 => ['pipe', 'w'], 2 => ['pipe', 'w']],
            $pipes,
            base_path(),
            $environment,
        );

        if ($handle === false) {
            throw TestFailure::lockHolderDidNotStart();
        }

        return ['handle' => $handle, 'stdout' => $pipes[1]];
    }

    /**
     * @param  resource  $stream
     */
    private function waitForLine($stream, string $expected): void
    {
        $line = fgets($stream);

        if ($line !== "{$expected}\n") {
            throw TestFailure::lockHolderSaid(var_export($line, true));
        }
    }

    public function test_a_replayed_session_start_with_a_changed_program_session_id_keeps_the_first_mapping(): void
    {
        $capabilities = new DriverCapabilities(
            'Test driver',
            'session starts',
            ['onSessionStart'],
            RewriteSupport::WithoutApproval,
        );

        $this->answerSessionStart('vendor-1', $capabilities);
        $this->answerSessionStart('vendor-2', $capabilities);

        $this->assertSame(
            'vendor-1',
            AgentSession::query()->with('currentConversation')->findOrFail(
                $this->target->sessionId,
            )->currentConversation?->native_id,
        );
        $this->assertSame(1, HookCall::query()->count());
    }

    private function answerSessionStart(string $vendorSessionId, DriverCapabilities $capabilities): void
    {
        $this->callAs('call-start', hash('sha256', 'call-start'));
        $start = new SessionStarted(
            TestActors::hookIdentity(1, 10, 'call-start', hash('sha256', 'call-start')),
            new SessionStartDetails($vendorSessionId, ContextStartType::Start, null),
        );

        $this->machine()->answer(
            $start,
            $capabilities,
            new OperationDeadline(3000),
            fn (HookAnswer $answer) => new DriverReply('{}', '', 0),
        );
    }
}
