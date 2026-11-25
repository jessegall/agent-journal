<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Contracts\Processes\ProcessRunCallers;
use App\Models\Access\User;
use App\Support\ActorIdentity;
use Domain\Tasks\Commands\RunTaskCheck\RunTaskCheckCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Events\TaskCheckRecorded;
use Domain\Tasks\Exceptions\TaskCheckRefused;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskCheck;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;
use Tests\Support\ActsAsOwner;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

/**
 * A worker makes a process run it opened a check of its current task run, once; a run of another caller and the
 * same run named again are refused.
 */
final class RunTaskCheckTest extends TestCase
{
    use ActsAsOwner;
    use CommitsHookRows;

    private const array TABLES = [
        'users',
        'tasks',
        'task_runs',
        'task_history',
        'task_checks',
        'agents',
        'agent_sessions',
        'agent_stacks',
        'assignments',
        'claim_authorizations',
        'command_receipts',
    ];

    public function test_a_check_runs_for_the_current_run_once_and_another_callers_run_is_refused(): void
    {
        Event::fake([TaskCheckRecorded::class]);
        $task = Task::factory()->create();
        $own = (string) Str::ulid();
        $other = (string) Str::ulid();

        $this->callersAre([
            $own => ActorIdentity::of($this->owner),
            $other => ActorIdentity::ofClass(User::class, TestIds::of(9)),
        ]);

        $this->journal->actAsUserId($this->owner->id);
        $this->runCommand(new StartTaskCommand($task->id));

        $this->runCommand(new RunTaskCheckCommand($task->id, 1, $own, 'acme verify'));

        $this->assertThrows(
            fn () => $this->runCommand(new RunTaskCheckCommand($task->id, 1, $other, 'acme verify')),
            TaskCheckRefused::class,
        );

        $this->assertThrows(
            fn () => $this->runCommand(new RunTaskCheckCommand($task->id, 1, $own, 'acme verify')),
            TaskCheckRefused::class,
        );

        $check = TaskCheck::query()->where('task_id', $task->id)->sole();
        $this->assertSame([1, null], [$check->run_number, $check->result_receipt_id]);
    }

    /**
     * @param  array<string, ActorIdentity>  $callers
     */
    private function callersAre(array $callers): void
    {
        $this->app->instance(ProcessRunCallers::class, new readonly class($callers) implements ProcessRunCallers
        {
            /**
             * @param  array<string, ActorIdentity>  $callers
             */
            public function __construct(private array $callers) {}

            public function callerOf(string $runId): Option
            {
                if (isset($this->callers[$runId])) {
                    return Some::create($this->callers[$runId]);
                }

                return None::create();
            }
        });
    }

    private function runCommand(object $command): void
    {
        $this->app->make(CommandBus::class)->run($command);
    }
}
