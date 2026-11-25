<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Declarations\SlotContext;
use Domain\Plans\Http\Pages\Resolvers\TaskPlanSection;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Spatie\LaravelData\Optional;
use Tests\Support\CommitsHookRows;

/**
 * Plans adds a task's plan and phase to Tasks' reader from its own tables, and nothing for a task in no plan.
 */
final class TaskPlanSectionTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'plans',
        'phases',
        'phase_tasks',
        'tasks',
        'users',
        'number_groups',
        'command_receipts',
    ];

    public function test_a_task_in_phase_two_names_its_plan_and_phase_and_a_loose_task_names_none(): void
    {
        $tasks = $this->journal->owner()->fixtures(TaskFixtures::class)->task('Placed')->task('Loose');
        [$placed, $loose] = [$tasks->taskCalled('Placed'), $tasks->taskCalled('Loose')];
        $plan = $this->journal->fixtures(PlanFixtures::class)
            ->plan('Release', title: 'Build the release page')
            ->phase('Release', 'Read')
            ->phaseWithTask('Release', 'Write', $placed->assignmentIdentity())
            ->planCalled('Release');

        $inPlan = $this->section()->read(SlotContext::record($placed->id));
        $outside = $this->section()->read(SlotContext::record($loose->id));

        $this->assertSame(
            [
                (string) $plan->number,
                'Build the release page',
                '2',
                'Write',
            ],
            [
                $inPlan->planNumber,
                $inPlan->planTitle,
                $inPlan->phaseNumber,
                $inPlan->phaseTitle,
            ],
        );

        $this->assertInstanceOf(Optional::class, $outside->planNumber);
    }

    private function section(): TaskPlanSection
    {
        return $this->app->make(TaskPlanSection::class);
    }

    private function structure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }
}
