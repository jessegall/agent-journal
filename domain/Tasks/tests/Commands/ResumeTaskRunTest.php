<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Contracts\Processes\RunClaims;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Records\AssignmentRecord;
use App\Support\ActorIdentity;
use App\Support\AssigneeIdentity;
use App\Support\RequestKey;
use App\Support\StartSessions;
use Domain\Tasks\Commands\BlockTask\BlockTaskCommand;
use Domain\Tasks\Commands\ResumeTaskRun\ResumeTaskRunCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Exceptions\TaskResumeCovered;
use Domain\Tasks\Exceptions\TaskRunStale;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;

/**
 * A released run is resumed explicitly: a direct holder that lost and regained the task cannot use its old claim but
 * resumes afresh.
 */
final class ResumeTaskRunTest extends TestCase
{
    use CommitsHookRows;

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
        'inbox_members',
        'assignments',
        'claim_authorizations',
        'command_receipts',
        'number_groups',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_a_direct_holder_that_regained_the_task_resumes_afresh(): void
    {
        $worker = $this->started('Third');
        $task = $this->tasks()->task('task')->taskCalled('task');

        $holding = AssignmentRecord::create(
            $task->assignmentIdentity(),
            AssigneeIdentity::of($worker->agent()->firstOrFail()),
        );

        $this->runAs($worker, new StartTaskCommand($task->id));
        $run = TaskRun::query()->where('task_id', $task->id)->sole();

        $holding->delete();
        AssignmentRecord::create($task->assignmentIdentity(), AssigneeIdentity::of($worker->agent()->firstOrFail()));

        $this->assertNull($this->holderOf($run));
        $this->assertSame(1, $this->runAs($worker, new ResumeTaskRunCommand($run->id)));
        $this->assertTrue($this->holderOf($run)?->isSameAs(ActorIdentity::of($worker->agent()->firstOrFail())));
    }

    public function test_a_resume_under_another_current_task_is_refused_and_changes_nothing(): void
    {
        $worker = $this->started('Fourth');
        $holder = AssigneeIdentity::of($worker->agent()->firstOrFail());
        $first = $this->tasks()->task('first')->taskCalled('first');
        $second = $this->tasks()->task('second')->taskCalled('second');
        AssignmentRecord::create($first->assignmentIdentity(), $holder);
        AssignmentRecord::create($second->assignmentIdentity(), $holder);
        $this->runAs($worker, new StartTaskCommand($first->id));
        $this->runAs($worker, new StartTaskCommand($second->id));

        $run = TaskRun::query()->where('task_id', $first->id)->sole();

        $this->assertThrows(
            fn () => $this->runAs($worker, new ResumeTaskRunCommand($run->id)),
            TaskResumeCovered::class,
            TaskResumeCovered::by($second->number, $first->number)->getMessage(),
        );
    }

    public function test_a_resume_of_a_run_left_behind_by_a_restart_is_refused_as_stale(): void
    {
        $worker = $this->started('Fifth');
        $task = $this->tasks()->task('task')->taskCalled('task');
        AssignmentRecord::create($task->assignmentIdentity(), AssigneeIdentity::of($worker->agent()->firstOrFail()));
        $this->runAs($worker, new StartTaskCommand($task->id));
        $first = TaskRun::query()->where('task_id', $task->id)->sole();
        $this->runAs($worker, new BlockTaskCommand($task->id, 1, 'Waits on the server.'));
        $this->runAs($worker, new StartTaskCommand($task->id));

        $this->assertThrows(fn () => $this->runAs($worker, new ResumeTaskRunCommand($first->id)), TaskRunStale::class);
    }

    private function runAs(AgentSession $start, StartTaskCommand|ResumeTaskRunCommand|BlockTaskCommand $command): mixed
    {
        $this->journal->actAsAgentIds($start->agent_id, $start->id);
        $this->app->make(RequestKey::class)->set((string) Str::ulid());

        return $this->app->make(CommandBus::class)->run($command);
    }

    private function holderOf(TaskRun $run): ActorIdentity|null
    {
        return $this->app->make(RunClaims::class)->holderOf($run->assignmentIdentity())->getOrElse(null);
    }

    private function started(string $name): AgentSession
    {
        return $this->app->make(StartSessions::class)
            ->start(
                Agent::create($name, 'main-agent', $this->localProject()),
                TestSelections::of('claude-code'),
                TestSelections::requestId(),
            )
            ->session;
    }

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }
}
