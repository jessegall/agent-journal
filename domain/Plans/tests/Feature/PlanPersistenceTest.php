<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Contracts\Actors\CurrentActorSetter;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\DomainRegistry;
use App\Values\OwnerAuthority;
use Database\Seeders\DatabaseSeeder;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Exceptions\TaskAlreadyInAPhase;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Contracts\TaskProgressCounter as TaskProgressCounterContract;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Resolvers\TaskProgressCounter;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;

final class PlanPersistenceTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    /**
     * Every installed domain, since the local seeders fill each of them.
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 4));
    }

    public function test_a_task_sits_in_one_phase_at_most(): void
    {
        $plan = Plan::factory()->create([
            'title' => 'Fix the login redirect',
            'type' => PlanType::Fix,
        ]);
        $task = $this->task('Write a failing test');
        $this->planStructure()->addTasks($this->planStructure()->addPhase($plan, 'Reproduce'), [$task->id]);

        $this->expectException(TaskAlreadyInAPhase::class);

        $this->planStructure()->addTasks($this->planStructure()->addPhase($plan, 'Fix'), [$task->id]);
    }

    public function test_tasks_count_progress_by_id_including_none(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(7)),
            new OwnerAuthority('test'),
        );

        $done = $this->task('Done');
        $done->finish('Done.');
        $started = $this->task('Started');
        $started->start(ActorIdentity::system());
        $open = $this->task('Open');
        $counts = $this->app->make(TaskProgressCounterContract::class);
        $this->assertInstanceOf(TaskProgressCounter::class, $counts);

        $progress = $counts->progressOf([
            $done->id,
            $started->id,
            $open->id,
        ]);

        $this->assertSame([
            1,
            1,
            0,
            3,
        ], [
            $progress->done,
            $progress->started,
            $progress->blocked,
            $progress->total,
        ]);
        $this->assertSame(0, $counts->progressOf([])->total);
    }

    public function test_every_agent_reads_every_plan(): void
    {
        Plan::factory()->create([
            'title' => 'Compare chat layouts',
            'type' => PlanType::Research,
        ]);

        $this->startRequestAs(TestIds::of(2), TestIds::of(20));

        $this->assertSame(['Compare chat layouts'], Plan::query()->pluck('title')->all());
    }

    public function test_the_local_seeders_fill_plans_with_phases_and_the_tasks_from_tasks(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->assertSame(3, Plan::query()->count());
        $this->assertCount(4, Plan::query()->where('title', 'Build the plans page')->sole()->taskIds());
    }

    private function task(string $title): Task
    {
        return Task::factory()->create(['title' => $title]);
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }
}
