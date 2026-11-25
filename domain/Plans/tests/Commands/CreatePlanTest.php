<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Commands;

use App\Exceptions\CommandInputInvalid;
use App\Models\Access\User;
use Domain\Plans\Commands\CreatePlan\CreatePlanCommand;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Plans\Tests\TestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\RefreshHookDatabase;

/**
 * A user or agent makes a plan: it is planned at its first revision with its brief, type and creator; a title and
 * brief at their limits are kept, and a title that is empty, too long or on two lines, or a brief past its limit, is
 * refused naming the field and keeps nothing.
 */
final class CreatePlanTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_a_plan_is_planned_at_its_first_revision_with_its_brief_type_and_creator(): void
    {
        $planId = $this->journal->run(new CreatePlanCommand('Release', 'Ship version 6.', PlanType::Build));

        $plan = Plan::query()->findOrFail($planId);
        $this->assertSame(
            ['Ship version 6.', PlanType::Build, PlanStatus::Planned, 1],
            [$plan->brief, $plan->type, $plan->status, $plan->revision],
        );
        $this->assertSame(
            [User::storedType(), $this->journal->ownerUser()->id],
            [$plan->creator_type, $plan->creator_id],
        );
    }

    public function test_a_title_and_brief_at_their_limits_are_kept(): void
    {
        $title = str_repeat('é', Plan::TITLE_CHARACTER_LIMIT);
        $brief = str_repeat('é', Plan::BRIEF_CHARACTER_LIMIT);

        $planId = $this->journal->run(new CreatePlanCommand($title, $brief, PlanType::Build));

        $this->assertSame($title, Plan::query()->findOrFail($planId)->title);
    }

    /**
     * @return iterable<string, array{string, string, string}>
     */
    public static function refusedInput(): iterable
    {
        yield 'a long title' => [str_repeat('é', Plan::TITLE_CHARACTER_LIMIT + 1), 'Brief', 'title'];

        yield 'a two-line title' => ["Release\nnow", 'Brief', 'title'];

        yield 'an empty title' => ['', 'Brief', 'title'];

        yield 'a long brief' => ['Release', str_repeat('é', Plan::BRIEF_CHARACTER_LIMIT + 1), 'brief'];
    }

    #[DataProvider('refusedInput')]
    public function test_input_past_its_limit_is_refused_naming_the_field(
        string $title,
        string $brief,
        string $field,
    ): void {
        $this->assertThrows(
            fn () => $this->journal->run(new CreatePlanCommand($title, $brief, PlanType::Build)),
            CommandInputInvalid::class,
            "{$field}:",
        );
        $this->assertSame(0, Plan::query()->count());
    }
}
