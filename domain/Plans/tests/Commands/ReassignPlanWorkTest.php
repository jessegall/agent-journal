<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Records\AssignmentRecord;
use App\Support\Access\AccessSettings;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentResult;
use App\Support\RecordIdentity;
use App\Support\RequestKey;
use Domain\Plans\Commands\AssignPlanWork\AssignPlanWorkCommand;
use Domain\Plans\Commands\ReassignPlanWork\ReassignPlanWorkCommand;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;

/**
 * A user hands a phase's work given out at once to another holder: the phase and its open tasks move to them
 * together.
 */
final class ReassignPlanWorkTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['users', 'agents', 'tasks', 'plans', 'phases', 'phase_tasks', 'assignments'];

    private AssigneeIdentity $builder;

    private Plan $plan;

    private Phase $working;

    private Phase $over;

    private Phase $empty;

    private Task $open;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->journal->actAsUserId($owner->id);
        $this->builder = AssigneeIdentity::of(Agent::create('Builder', 'read-only-helper', $this->localProject()));
        $this->plan = Plan::factory()->create(['title' => 'Release', 'type' => PlanType::Build]);
        $this->open = Task::factory()->create(['title' => 'Open']);
        $finished = Task::factory()->create(['title' => 'Finished']);
        $cancelled = Task::factory()->create(['title' => 'Cancelled']);
        $finished->finish('Done.');
        $cancelled->cancel('Not needed.');
        $this->working = $this->planStructure()->addPhase($this->plan, 'Working');
        $this->planStructure()->addTasks($this->working, [$this->open->id]);
        $this->over = $this->planStructure()->addPhase($this->plan, 'Over');
        $this->planStructure()->addTasks($this->over, [$finished->id, $cancelled->id]);
        $this->empty = $this->planStructure()->addPhase($this->plan, 'Empty');
    }

    public function test_a_phase_cascade_moves_to_the_new_holder_with_its_tasks(): void
    {
        $root = $this->assignWork($this->working->assignmentIdentity(), $this->builder)->outcomes[0]->current;
        $reviewer = AssigneeIdentity::of(Agent::create('Reviewer', 'read-only-helper', $this->localProject()));

        $this->app->make(RequestKey::class)->set((string) Str::ulid());
        $this->app->make(CommandBus::class)->run(
            new ReassignPlanWorkCommand($this->working->assignmentIdentity(), $root->reference, $reviewer),
        );

        $this->assertSame([$reviewer->id, $reviewer->id], AssignmentRecord::query()->pluck('holder_id')->all());
    }

    /**
     * @return list<string>
     */
    private function heldTypes(): array
    {
        return array_values(AssignmentRecord::query()->pluck('record_type')->all());
    }

    private function assignWork(RecordIdentity $root, AssigneeIdentity $recipient): AssignmentResult
    {
        $this->app->make(RequestKey::class)->set((string) Str::ulid());

        return $this->app->make(CommandBus::class)->run(new AssignPlanWorkCommand($root, $recipient));
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }
}
