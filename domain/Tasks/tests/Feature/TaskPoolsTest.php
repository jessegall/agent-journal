<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Models\Agents\Agent;
use App\Support\ActorIdentity;
use App\Support\PoolReference;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Support\Assignments\NamedTaskPoolFactory;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Domain\Tasks\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;

/**
 * Tasks declares its auto-assigner and the pools tasks.open and tasks.named at boot; each pool refuses a reference
 * that does not fit it, and a named pool opens to its tasks in the listed order while every one of them exists.
 */
final class TaskPoolsTest extends TestCase
{
    use RefreshHookDatabase;

    private ActorIdentity $builder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();

        $this->builder = ActorIdentity::ofClass(Agent::class, TestIds::of(7));
        $this->journal->actAsUserId(TestIds::of(1));
    }

    public function test_a_named_pool_whose_task_went_missing_does_not_open(): void
    {
        $kept = $this->tasks()->task('kept')->taskCalled('kept')->id;
        $gone = $this->tasks()->task('gone')->taskCalled('gone');
        $reference = new PoolReference('tasks.named', null, [
            $kept,
            $gone->id,
        ]);
        $gone->delete();

        $this->expectException(TaskMissing::class);

        $this->app->make(NamedTaskPoolFactory::class)->open($reference, $this->builder);
    }

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }
}
