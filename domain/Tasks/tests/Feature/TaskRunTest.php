<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Contracts\Bus\CommandBus;
use App\Contracts\Processes\RunClaims;
use App\Exceptions\CommandInputInvalid;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Support\ActorIdentity;
use App\Support\StartSessions;
use Domain\Tasks\Commands\BlockTask\BlockTaskCommand;
use Domain\Tasks\Commands\CancelTask\CancelTaskCommand;
use Domain\Tasks\Commands\FinishTask\FinishTaskCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Enums\TaskRunState;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Domain\Tasks\Tests\TestCase;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\ActsAsOwner;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;

/**
 * A task run is its own record claimed through Core: starting opens run 1 claimed by the starter, and finishing ends
 * the claim and keeps the run.
 */
final class TaskRunTest extends TestCase
{
    use ActsAsOwner;
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = [
        'users',
        'tasks',
        'task_runs',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'links',
        'inboxes',
        'assignments',
        'claim_authorizations',
        'command_receipts',
    ];

    public function test_starting_opens_a_claimed_run_and_finishing_ends_the_claim(): void
    {
        $task = Task::factory()->create();
        $this->startUserRequestAs($this->owner->id);
        $bus = $this->app->make(CommandBus::class);

        $runNumber = $bus->run(new StartTaskCommand($task->id));
        $run = TaskRun::query()->where('task_id', $task->id)->sole();

        $this->assertSame(1, $runNumber);
        $this->assertTrue($this->holderOf($run)?->isSameAs(ActorIdentity::of($this->owner)));

        $bus->run(new FinishTaskCommand($task->id, 1, 'Done'));

        $this->assertSame(TaskRunState::Finished, $run->refresh()->state);
        $this->assertNull($this->holderOf($run));
    }

    public function test_a_note_or_reason_over_its_limit_is_refused_before_the_run_ends_and_8000_pass(): void
    {
        $task = Task::factory()->create();
        $this->startUserRequestAs($this->owner->id);
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new StartTaskCommand($task->id));
        $tooLong = str_repeat('a', Task::NOTE_CHARACTER_LIMIT + 1);

        $finish = new FinishTaskCommand($task->id, 1, $tooLong);
        $block = new BlockTaskCommand($task->id, 1, $tooLong);
        $cancel = new CancelTaskCommand($task->id, $tooLong);

        $this->assertThrows(fn () => $bus->run($finish), CommandInputInvalid::class, 'note:');
        $this->assertThrows(fn () => $bus->run($block), CommandInputInvalid::class, 'reason:');
        $this->assertThrows(fn () => $bus->run($cancel), CommandInputInvalid::class, 'reason:');
        $this->assertSame(TaskState::Started, $task->refresh()->state);

        $bus->run(new FinishTaskCommand($task->id, 1, str_repeat('a', Task::NOTE_CHARACTER_LIMIT)));

        $this->assertSame(TaskState::Finished, $task->refresh()->state);
    }

    private function holderOf(TaskRun $run): ActorIdentity|null
    {
        return $this->app->make(RunClaims::class)->holderOf($run->assignmentIdentity())->getOrElse(null);
    }

    private function started(string $name): AgentSession
    {
        return $this->app->make(StartSessions::class)
            ->start(Agent::create($name, 'main-agent'), TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;
    }
}
