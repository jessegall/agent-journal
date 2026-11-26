<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Commands;

use App\Bus\Exceptions\CommandInputInvalid;
use Domain\Plans\Commands\AddPhase\AddPhaseCommand;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Exceptions\PlanMissing;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\Plan;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Plans\Tests\TestCase;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;

/**
 * A user adds phases to a plan, each after the last; a title past its limit and a plan that is not there are refused
 * and add nothing.
 */
#[TestsCommand(AddPhaseCommand::class)]
final class AddPhaseTest extends TestCase
{
    use RefreshHookDatabase;

    private Plan $plan;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();

        $this->plan = $this->journal->fixtures(PlanFixtures::class)
            ->createPlan('Release', 'Ship it.', PlanType::Build);
    }

    public function test_phases_are_added_each_after_the_last(): void
    {
        foreach ([
            'Read',
            'Build',
            'Check',
        ] as $title) {
            $this->journal->run(new AddPhaseCommand($this->plan->id, $title));
        }

        $this->assertSame(
            ['Read', 'Build', 'Check'],
            Phase::query()->where('plan_id', $this->plan->id)->orderBy('number')->pluck('title')->all(),
        );
    }

    public function test_a_long_title_and_a_missing_plan_are_refused_and_add_nothing(): void
    {
        $this->assertThrows(
            fn () => $this->journal->run(
                new AddPhaseCommand($this->plan->id, str_repeat('é', Plan::TITLE_CHARACTER_LIMIT + 1)),
            ),
            CommandInputInvalid::class,
            'title:',
        );

        $this->assertThrows(
            fn () => $this->journal->run(new AddPhaseCommand('01jd8x0g9m3qz6v4k2t7r00000', 'Read')),
            PlanMissing::class,
        );

        $this->assertSame(0, Phase::query()->count());
    }
}
