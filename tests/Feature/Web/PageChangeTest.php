<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Bus\Contracts\CommandBus;
use App\Drivers\Enums\HookDriver;
use App\Profiles\Commands\SwitchAccount;
use App\Profiles\Models\Account;
use App\Profiles\Values\AccountLabel;
use App\Web\Events\PageChanged;
use Domain\Plans\Api\Events\PlanProgressChanged;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanStructure;
use Domain\Tasks\Api\Events\TaskFinished;
use Domain\Tasks\Commands\CancelTask;
use Domain\Tasks\Commands\FinishTask;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Models\Task;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\UiDeclarations\Shelf\ShelfMoved;
use Tests\Support\CommitsHookRows;
use Tests\Support\Exceptions\SimulatedFailure;
use Tests\Support\WatchesPageChanges;
use Tests\TestCase;

/**
 * A committed change that a page shows becomes one page change for the users LoginTest allows; nothing else does.
 */
final class PageChangeTest extends TestCase
{
    use CommitsHookRows;
    use WatchesPageChanges;

    /**
     * The changes commit for real, so a rolled back one is judged by the real transaction manager.
     */
    private const array TABLES = [
        'users',
        'tasks',
        'plans',
        'phases',
        'phase_tasks',
        'links',
        'assignments',
        'accounts',
        'active_accounts',
        'command_receipts',
    ];

    public function test_a_page_fact_no_owner_exports_changes_no_page(): void
    {
        event(new ShelfMoved());

        Event::assertNotDispatched(PageChanged::class);
    }

    public function test_a_finished_task_of_a_plan_moves_the_plan_and_changes_the_page(): void
    {
        $task = Task::factory()->create(['title' => 'List the plans']);
        $plan = Plan::factory()->create(['title' => 'Build the release page', 'type' => PlanType::Build]);
        $this->planStructure()->addTasks($this->planStructure()->addPhase($plan, 'Read'), [$task->id]);
        $progress = [];
        Event::listen(PlanProgressChanged::class, function (PlanProgressChanged $changed) use (&$progress): void {
            $progress[] = $changed->planId;
        });

        $this->app->make(CommandBus::class)->run(new FinishTask($task->id, 0, 'Done.'));

        $this->assertSame([$plan->id], $progress);
        Event::assertDispatchedTimes(PageChanged::class, 1);
    }

    public function test_choosing_an_account_changes_the_accounts_page_once(): void
    {
        $account = Account::create(HookDriver::Codex, AccountLabel::from('Work'), '/journal/accounts/work');

        $this->app->make(CommandBus::class)->run(new SwitchAccount($account->id));
        $this->app->make(CommandBus::class)->run(new SwitchAccount($account->id));

        Event::assertDispatchedTimes(PageChanged::class, 1);
    }

    public function test_a_task_outside_every_plan_changes_no_page(): void
    {
        $this->app->make(CommandBus::class)->run(
            new CancelTask(Task::factory()->create(['title' => 'Loose task'])->id, 'Dropped.'),
        );

        Event::assertNotDispatched(PageChanged::class);
    }

    public function test_a_rolled_back_change_sends_nothing(): void
    {
        $task = Task::factory()->create(['title' => 'List the plans']);
        $this->planStructure()->addTasks($this->planStructure()->addPhase(Plan::factory()->create(
            ['title' => 'Build the release page', 'type' => PlanType::Build],
        ), 'Read'), [$task->id]);

        $this->assertThrows(
            fn () => $this->app->make(ConnectionInterface::class)->transaction(function () use ($task): void {
                $this->app->make('events')->dispatch(new TaskFinished($task->id, TaskState::Started));

                throw SimulatedFailure::of('The change fails.');
            }),
            SimulatedFailure::class,
        );

        Event::assertNotDispatched(PageChanged::class);
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }
}
