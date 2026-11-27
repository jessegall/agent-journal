<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Machinery;

use App\Models\Agents\AgentSession;
use App\Sessions\StartSessions;
use Domain\Plans\Events\PlanProgressChanged;
use Domain\Plans\Listeners\CountPhaseTaskStates;
use Domain\Plans\Models\Plan;
use Domain\Plans\PlansDomain;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Illuminate\Events\Dispatcher;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\Settings\SwitchesDomainsOff;

/**
 * A task's start tells the plan that holds it, after the commit: a task in no phase tells no plan, and with Plans
 * switched off the start still works and tells none.
 */
#[TestsMachinery(CountPhaseTaskStates::class)]
final class TaskStartProgressTest extends TestCase
{
    use CommitsHookRows;
    use SwitchesDomainsOff;

    private const array TABLES = [
        'tasks',
        'task_runs',
        'claim_authorizations',
        'assignments',
        'agent_stacks',
        'command_receipts',
        'users',
        'agents',
        'agent_sessions',
        'number_groups',
        'inboxes',
        'inbox_members',
        'task_history',
        'plans',
        'phases',
        'phase_tasks',
        'session_tokens',
        'hook_calls',
        'links',
        'settings_records',
    ];

    private AgentSession $session;

    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class, TasksDomain::class);
    }

    protected function setUp(): void
    {
        parent::setUp();

        $agent = $this->journal->owner()->idleAgent('Worker', 'main-agent')->agentCalled('Worker');

        $this->session = $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;
    }

    public function test_the_plan_holding_the_task_at_its_start_is_the_one_told_after_the_commit(): void
    {
        $plan = Plan::factory()->create();
        $task = $this->tasks()->createTask('task');
        $this->planStructure()->addTasks($this->planStructure()->addPhase($plan, 'Work'), [$task->id]);
        $progress = $this->heard();

        $this->start($task);

        $this->assertSame([$plan->id], array_map(fn (PlanProgressChanged $changed) => $changed->planId, $progress()));
    }

    public function test_a_task_in_no_phase_tells_no_plan(): void
    {
        $progress = $this->heard();

        $this->start($this->tasks()->createTask('Loose'));

        $this->assertSame([], $progress());
    }

    public function test_with_plans_switched_off_the_start_works_and_tells_no_plan(): void
    {
        $plan = Plan::factory()->create();
        $task = $this->tasks()->createTask('task');
        $this->planStructure()->addTasks($this->planStructure()->addPhase($plan, 'Work'), [$task->id]);
        $this->switchDomainOff('plans');
        $progress = $this->heard();

        $this->start($task);

        $this->assertSame(TaskStatus::Started, $task->refresh()->status);
        $this->assertSame([], $progress());
    }

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }

    private function start(Task $task): void
    {
        $this->journal->actAsAgentIds(
            $this->session->agent_id,
            $this->session->id,
        )->run(new StartTaskCommand($task->id));
    }

    /**
     * Each plan progress change the dispatcher delivers from now on.
     *
     * @return callable(): list<PlanProgressChanged>
     */
    private function heard(): callable
    {
        $heard = [];

        $this->app->make(Dispatcher::class)->listen(
            PlanProgressChanged::class,
            function (PlanProgressChanged $changed) use (&$heard): void {
                $heard[] = $changed;
            },
        );

        return function () use (&$heard): array {
            return $heard;
        };
    }
}
