<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Bus\Contracts\CommandBus;
use App\Processes\Support\ConnectedProject;
use App\Processes\Support\ProjectKey;
use Domain\Tasks\Commands\CreateTask\CreateTaskCommand;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

/**
 * A task made through a connected binding carries that binding's environment, a task made here carries none, and the
 * environment filter finds a user's tasks of one environment while no filter leaves every list as it was.
 */
final class TaskEnvironmentTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['tasks'];

    public function test_a_task_carries_the_environment_of_the_binding_it_was_made_through(): void
    {
        $research = $this->createThrough('research-environment', 'Review the release');
        $production = $this->createThrough('production-environment', 'Ship the release');
        $here = $this->createHere('Tidy the notes');

        $this->assertSame('research-environment', $research->environment_id);
        $this->assertSame('production-environment', $production->environment_id);
        $this->assertNull($here->environment_id);

        $this->assertSame(
            [$research->id],
            Task::query()->inEnvironments(['research-environment'])->pluck('id')->all(),
        );

        $this->assertSame(3, Task::query()->inEnvironments([])->count());
    }

    private function createThrough(string $environmentId, string $title): Task
    {
        $this->app->forgetScopedInstances();
        $this->app->make(ProjectKey::class)->connect(new ConnectedProject('shop', '/work/shop', $environmentId));

        return $this->create($title);
    }

    private function createHere(string $title): Task
    {
        $this->app->forgetScopedInstances();

        return $this->create($title);
    }

    private function create(string $title): Task
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(7)), new OwnerAuthority('test'));
        $id = $this->app->make(CommandBus::class)->run(new CreateTaskCommand($title, 'What it asks.'));

        return Task::query()->findOrFail($id);
    }
}
