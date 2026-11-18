<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Web\Events\PageChanged;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Plans\Api\Events\PlanProgressChanged;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Tasks\Actions\ChangeTaskState;
use Domain\Tasks\Api\Events\TaskFinished;
use Domain\Tasks\Models\Task;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Support\Facades\Event;
use RuntimeException;
use Tests\Fixtures\UiDeclarations\Shelf\ShelfMoved;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A committed change that a page shows becomes one page change for the users Access allows; nothing else does.
 */
final class PageChangeTest extends TestCase
{
    use RefreshHookDatabase;

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser($this->owner->id));
        Event::fake([PageChanged::class]);
    }

    public function test_a_new_modules_fact_changes_the_page_once_without_any_change_to_web(): void
    {
        event(new ShelfMoved);

        Event::assertDispatchedTimes(PageChanged::class, 1);
    }

    public function test_a_finished_task_of_a_plan_moves_the_plan_and_changes_the_page(): void
    {
        $task = Task::query()->create(['title' => 'List the plans']);
        $plan = Plan::query()->create(['title' => 'Build the release page', 'type' => PlanType::Build]);
        $plan->addPhase('Read')->addTasks([$task->id]);
        $progress = [];
        Event::listen(PlanProgressChanged::class, function (PlanProgressChanged $changed) use (&$progress): void {
            $progress[] = $changed->planId;
        });

        $this->app->make(ChangeTaskState::class)->finish($task);

        $this->assertSame([$plan->id], $progress);
        Event::assertDispatchedTimes(PageChanged::class, 1);
    }

    public function test_a_task_outside_every_plan_changes_no_page(): void
    {
        $this->app->make(ChangeTaskState::class)->cancel(Task::query()->create(['title' => 'Loose task']));

        Event::assertNotDispatched(PageChanged::class);
    }

    public function test_a_rolled_back_change_sends_nothing(): void
    {
        $task = Task::query()->create(['title' => 'List the plans']);
        Plan::query()->create(['title' => 'Build the release page', 'type' => PlanType::Build])->addPhase('Read')->addTasks([$task->id]);

        try {
            $this->app->make(ConnectionInterface::class)->transaction(function () use ($task): void {
                $this->app->make('events')->dispatch(new TaskFinished($task->id));

                throw new RuntimeException('The change fails.');
            });
        } catch (RuntimeException) {
        }

        Event::assertNotDispatched(PageChanged::class);
    }
}
