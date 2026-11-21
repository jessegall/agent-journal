<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Agents\Models\Agent;
use App\Assignments\Support\AssigneeIdentity;
use App\Processes\Contracts\VerificationTiming;
use App\Processes\Support\OpenTiming;
use App\Processes\Values\TimingVerdict;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PhaseTiming;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * An agent's tests and checks wait while the current phase of the started plan it holds has open or started tasks,
 * and run once they ended (rule 31, story 148, plan 14 decision D18).
 */
final class PhaseTimingTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = ['agents', 'tasks', 'plans', 'phases', 'phase_tasks', 'assignments'];

    private Agent $agent;

    private Plan $plan;

    /**
     * @var list<Task>
     */
    private array $tasks;

    protected function setUp(): void
    {
        parent::setUp();

        $this->agent = Agent::create('Worker', 'writing-helper');
        $this->plan = Plan::factory()->create(['title' => 'Phase timing', 'state' => PlanState::Started]);
        $this->tasks = [Task::factory()->create(['title' => 'First']), Task::factory()->create(['title' => 'Second'])];
        $this->planStructure()->addTasks(
            $this->planStructure()->addPhase($this->plan, 'Build'),
            array_map(fn (Task $task): string => $task->id, $this->tasks),
        );
        $this->startUserRequestAs(TestIds::of(7));
        $writer = $this->app->make(AssignmentWriterInTransaction::class);
        $writer->assign($this->plan->assignmentIdentity(), AssigneeIdentity::of($this->agent));
    }

    public function test_the_plans_domain_fills_in_the_phase_timing(): void
    {
        $this->assertInstanceOf(PhaseTiming::class, $this->app->make(VerificationTiming::class));
        $this->assertTrue(new OpenTiming()->forCaller()->isAllowed());
    }

    public function test_an_agent_in_an_unwritten_phase_is_refused_naming_its_tasks(): void
    {
        $verdict = $this->timingForAgent();

        $this->assertFalse($verdict->isAllowed());
        $this->assertSame([$this->tasks[0]->number, $this->tasks[1]->number], $verdict->unfinishedTasks);
        $this->assertStringStartsWith('phase-timing:', $verdict->reason());
    }

    public function test_once_the_phase_tasks_ended_the_agent_may_run_its_checks(): void
    {
        foreach ($this->tasks as $task) {
            $task->finish('Done.');
        }

        $this->assertTrue($this->timingForAgent()->isAllowed());
    }

    #[TimeLimit(seconds: 20, reason: 'It creates and numbers five hundred phases through the plan model.')]
    public function test_an_open_task_after_five_hundred_phases_still_holds_checks(): void
    {
        foreach ($this->tasks as $task) {
            $task->finish('Done.');
        }

        for ($number = 2; $number <= 500; $number++) {
            $this->planStructure()->addPhase($this->plan, "Phase {$number}");
        }

        $task = Task::factory()->create(['title' => 'Finish the plan']);
        $phase = $this->planStructure()->addPhase($this->plan, 'Finish');
        $this->planStructure()->addTasks($phase, [$task->id]);

        $verdict = $this->timingForAgent();

        $this->assertFalse($verdict->isAllowed());
        $this->assertSame(501, $verdict->phase);
        $this->assertSame([$task->number], $verdict->unfinishedTasks);
    }

    public function test_a_blocked_phase_allows_checks_even_when_a_later_phase_has_open_tasks(): void
    {
        foreach ($this->tasks as $task) {
            $task->block('Waits.');
        }

        $later = Task::factory()->create(['title' => 'Wait for the build']);
        $this->planStructure()->addTasks($this->planStructure()->addPhase($this->plan, 'Later'), [$later->id]);

        $this->assertTrue($this->timingForAgent()->isAllowed());
    }

    public function test_a_user_is_not_held(): void
    {
        $this->app->forgetScopedInstances();
        $this->startUserRequestAs(TestIds::of(7));

        $this->assertTrue($this->app->make(VerificationTiming::class)->forCaller()->isAllowed());
    }

    private function timingForAgent(): TimingVerdict
    {
        $this->app->forgetScopedInstances();
        $this->startRequestAs($this->agent->id, TestIds::of(80));

        return $this->app->make(VerificationTiming::class)->forCaller();
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }
}
