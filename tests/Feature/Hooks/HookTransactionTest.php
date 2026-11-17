<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Domain\Hooks\Models\HookCall;
use App\Domain\Hooks\OperationDeadline;
use App\Domain\Hooks\Programs\ProgramReplies;
use App\Domain\Hooks\Stack\HookAnswer;
use App\Domain\Hooks\Stack\WalkStep;
use App\Domain\Hooks\StackLockTimedOut;
use Illuminate\Support\Facades\DB;
use Tests\Fixtures\Hooks\TestFailure;
use Tests\Support\CommittedHookStack;
use Tests\TestCase;

final class HookTransactionTest extends TestCase
{
    use CommittedHookStack;

    public function test_a_hook_waiting_on_a_held_stack_lock_times_out_and_keeps_nothing(): void
    {
        $config = $this->app->make('config');
        $config->set('database.connections.hooks_holder', $config->get('database.connections.'.$config->get('database.default')));
        $holder = DB::connection('hooks_holder');
        $holder->beginTransaction();
        $holder->table('agent_stacks')->lockForUpdate()->get();
        $startedAt = microtime(true);

        try {
            $this->machine()->answer($this->stop(), $this->capabilities(), new OperationDeadline(300), fn (HookAnswer $answer) => ProgramReplies::stop($answer));
            $this->fail('The hook did not time out on the held lock.');
        } catch (StackLockTimedOut) {
            $this->assertLessThan(2.0, microtime(true) - $startedAt);
        } finally {
            $holder->rollBack();
            $holder->disconnect();
        }

        $this->assertSame(0, HookCall::query()->count());
    }

    public function test_a_hook_waits_for_a_push_another_process_holds_and_then_sees_it(): void
    {
        $process = $this->startLockHolder(holdMilliseconds: 400, taskNumber: 43);

        try {
            $this->waitForLine($process['stdout'], 'locked');
            $startedAt = microtime(true);

            $reply = $this->machine()->answer($this->stop(), $this->capabilities(), new OperationDeadline(5000), fn (HookAnswer $answer) => ProgramReplies::stop($answer));

            $waited = microtime(true) - $startedAt;
        } finally {
            $this->assertSame("committed\n", stream_get_contents($process['stdout']));
            proc_close($process['handle']);
        }

        $this->assertGreaterThan(0.2, $waited);
        $this->assertStringContainsString('Task 43 still needs work', $reply->stdout);
        $this->assertSame(['pushed-by-other-process prevent_stop'], array_map(
            fn (WalkStep $step) => "{$step->frameId} {$step->answer->value}",
            HookCall::query()->sole()->steps->steps,
        ));
    }

    /**
     * @return array{handle: resource, stdout: resource}
     */
    private function startLockHolder(int $holdMilliseconds, int $taskNumber): array
    {
        $connection = $this->app->make('config')->get('database.connections.'.$this->app->make('config')->get('database.default'));
        $environment = [
            ...getenv(),
            'LOCK_DB_HOST' => (string) $connection['host'],
            'LOCK_DB_PORT' => (string) $connection['port'],
            'LOCK_DB_DATABASE' => (string) $connection['database'],
            'LOCK_DB_USERNAME' => (string) $connection['username'],
            'LOCK_DB_PASSWORD' => (string) $connection['password'],
            'LOCK_AGENT_ID' => (string) $this->target->agentId,
            'LOCK_SESSION_ID' => (string) $this->target->sessionId,
            'LOCK_HOLD_MILLISECONDS' => (string) $holdMilliseconds,
            'LOCK_TASK_NUMBER' => (string) $taskNumber,
        ];

        $handle = proc_open([PHP_BINARY, base_path('tests/bin/hold-stack-lock.php')], [1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes, base_path(), $environment);

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
}
