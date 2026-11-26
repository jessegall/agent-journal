<?php

declare(strict_types=1);

namespace Tests\Machinery\Web;

use App\Commands\Accounts\SwitchAccount\SwitchAccountCommand;
use App\Contracts\Bus\CommandBus;
use App\Events\Web\PageChanged;
use App\Listeners\BroadcastPageChange;
use App\Models\Accounts\Account;
use App\Support\DefaultDrivers;
use App\Values\AccountLabel;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Events\PlanProgressChanged;
use Domain\Plans\Models\Plan;
use Domain\Plans\PlansDomain;
use Domain\Plans\Support\PlanStructure;
use Domain\Tasks\Commands\CancelTask\CancelTaskCommand;
use Domain\Tasks\Commands\FinishTask\FinishTaskCommand;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\WatchesPageChanges;
use Tests\TestCase;

/**
 * A committed change that a page shows becomes one page change for the users LoginTest allows; nothing else does.
 */
#[TestsMachinery(BroadcastPageChange::class)]
final class PageChangeTest extends TestCase
{
    use CommitsHookRows;
    use WatchesPageChanges;

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class, TasksDomain::class);
    }

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

    public function test_a_finished_task_of_a_plan_moves_the_plan_and_changes_the_page(): void
    {
        $task = Task::factory()->create(['title' => 'List the plans']);
        $plan = Plan::factory()->create(['title' => 'Build the release page', 'type' => PlanType::Build]);
        $this->planStructure()->addTasks($this->planStructure()->addPhase($plan, 'Read'), [$task->id]);
        $progress = [];
        Event::listen(PlanProgressChanged::class, function (PlanProgressChanged $changed) use (&$progress): void {
            $progress[] = $changed->planId;
        });

        $this->app->make(CommandBus::class)->run(new FinishTaskCommand($task->id, 0, 'Done.'));

        $this->assertSame([$plan->id], $progress);
        // One change for the finished task (the Tasks pages) and one for the plan it moved.
        Event::assertDispatchedTimes(PageChanged::class, 2);
    }

    public function test_choosing_an_account_changes_the_accounts_page_once(): void
    {
        $account = Account::create(DefaultDrivers::CODEX, AccountLabel::from('Work'), '/journal/accounts/work');

        $this->app->make(CommandBus::class)->run(new SwitchAccountCommand($account->id));
        $this->app->make(CommandBus::class)->run(new SwitchAccountCommand($account->id));

        Event::assertDispatchedTimes(PageChanged::class, 1);
    }

    public function test_a_task_outside_every_plan_changes_only_the_task_pages(): void
    {
        $this->app->make(CommandBus::class)->run(
            new CancelTaskCommand(Task::factory()->create(['title' => 'Loose task'])->id, 'Dropped.'),
        );

        Event::assertDispatchedTimes(PageChanged::class, 1);
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }
}
