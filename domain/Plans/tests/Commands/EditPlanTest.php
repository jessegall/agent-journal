<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Commands;

use App\Exceptions\CommandInputInvalid;
use Domain\Plans\Commands\EditPlan\EditPlanCommand;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Exceptions\PlanRevisionChanged;
use Domain\Plans\Models\Plan;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Plans\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;

/**
 * A user changes a plan at the revision they read: what they name changes, the rest stays and the plan goes one
 * revision on; an edit at a stale revision is a conflict that keeps the newer text, and a title past its limit is
 * refused naming the field.
 */
final class EditPlanTest extends TestCase
{
    use RefreshHookDatabase;

    private Plan $plan;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();

        $this->plan = $this->journal->fixtures(PlanFixtures::class)
            ->plan('First', 'First brief', PlanType::Build)
            ->planCalled('First');
    }

    public function test_an_edit_changes_what_it_names_and_moves_the_revision_on(): void
    {
        $revision = $this->journal->run(
            new EditPlanCommand($this->plan->id, 1, brief: 'Second brief', type: PlanType::Fix),
        );

        $this->plan->refresh();
        $this->assertSame(2, $revision);

        $this->assertSame(
            ['First', 'Second brief', PlanType::Fix],
            [$this->plan->title, $this->plan->brief, $this->plan->type],
        );
    }

    public function test_an_edit_at_a_stale_revision_is_a_conflict_and_keeps_the_newer_text(): void
    {
        $this->journal->run(new EditPlanCommand($this->plan->id, 1, 'Second'));

        $this->assertThrows(
            fn () => $this->journal->run(new EditPlanCommand($this->plan->id, 1, 'Stale')),
            PlanRevisionChanged::class,
        );

        $this->assertSame(['Second', 2], [$this->plan->refresh()->title, $this->plan->revision]);
    }

    public function test_a_title_past_its_limit_is_refused_naming_the_field(): void
    {
        $this->assertThrows(
            fn () => $this->journal->run(
                new EditPlanCommand($this->plan->id, 1, str_repeat('é', Plan::TITLE_CHARACTER_LIMIT + 1)),
            ),
            CommandInputInvalid::class,
            'title:',
        );

        $this->assertSame(1, $this->plan->refresh()->revision);
    }
}
