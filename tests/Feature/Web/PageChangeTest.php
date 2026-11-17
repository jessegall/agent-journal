<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Core\Actors\Support\ActorContext;
use App\Core\Actors\Contracts\CurrentActorSetter;
use App\Core\Web\Events\PageChanged;
use App\Core\Web\Events\UserChannel;
use App\Domain\Access\Models\User;
use App\Domain\Access\Support\AccessSettings;
use App\Domain\Plans\Api\Events\PlanProgressChanged;
use App\Domain\Plans\Enums\PlanKind;
use App\Domain\Plans\Models\Plan;
use App\Domain\Rules\Actions\ProposeRule;
use App\Domain\Rules\Actions\RemoveRule;
use App\Domain\Rules\Actions\ReviewRule;
use App\Domain\Rules\Models\Rule;
use App\Domain\Tasks\Actions\ChangeTaskState;
use App\Domain\Tasks\Api\Events\TaskFinished;
use App\Domain\Tasks\Models\Task;
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

    public function test_an_approved_rule_tells_the_owner_once_on_their_private_channel(): void
    {
        $rule = $this->app->make(ProposeRule::class)->propose('Every phase ends with its tests.');

        $this->app->make(ReviewRule::class)->approve($rule->id);

        Event::assertDispatchedTimes(PageChanged::class, 1);
        Event::assertDispatched(PageChanged::class, fn (PageChanged $change) => $change->userIds === [$this->owner->id]
            && $change->broadcastOn()[0]->name === 'private-'.UserChannel::nameFor($this->owner->id)
            && $change->broadcastWith() === []);
    }

    public function test_a_new_modules_fact_changes_the_page_once_without_any_change_to_web(): void
    {
        event(new ShelfMoved);

        Event::assertDispatchedTimes(PageChanged::class, 1);
    }

    public function test_a_removed_rule_changes_the_page_too(): void
    {
        $this->app->make(RemoveRule::class)->remove(Rule::query()->create(['text' => 'Old rule.']));

        Event::assertDispatchedTimes(PageChanged::class, 1);
    }

    public function test_a_finished_task_of_a_plan_moves_the_plan_and_changes_the_page(): void
    {
        $task = Task::query()->create(['title' => 'List the plans']);
        $plan = Plan::query()->create(['title' => 'Build the release page', 'kind' => PlanKind::Build]);
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
        Plan::query()->create(['title' => 'Build the release page', 'kind' => PlanKind::Build])->addPhase('Read')->addTasks([$task->id]);

        try {
            $this->app->make(ConnectionInterface::class)->transaction(function () use ($task): void {
                $this->app->make('events')->dispatch(new TaskFinished($task->id));

                throw new RuntimeException('The change fails.');
            });
        } catch (RuntimeException) {
        }

        Event::assertNotDispatched(PageChanged::class);
    }

    public function test_with_no_owner_nobody_is_told(): void
    {
        $this->app->instance(AccessSettings::class, new AccessSettings(null));

        $this->app->make(RemoveRule::class)->remove(Rule::query()->create(['text' => 'Old rule.']));

        Event::assertNotDispatched(PageChanged::class);
    }
}
