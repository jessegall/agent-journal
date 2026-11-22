<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandInputInvalid;
use Domain\Plans\Commands\AddPhase\AddPhaseCommand;
use Domain\Plans\Commands\CancelPlan\CancelPlanCommand;
use Domain\Plans\Commands\CreatePlan\CreatePlanCommand;
use Domain\Plans\Commands\EditPlan\EditPlanCommand;
use Domain\Plans\Commands\FinishPlan\FinishPlanCommand;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Plans\Tests\TestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\ActsAsTestUser;
use Tests\Support\CommitsHookRows;

/**
 * Plan commands refuse text past their limits, or a missing title, note or reason, with invalid_input before
 * anything is written.
 */
final class PlanInputLimitsTest extends TestCase
{
    use ActsAsTestUser;
    use CommitsHookRows;

    private const array TABLES = ['plans', 'command_receipts'];

    private const string PLAN_ID = '01jd8x0g9m3qz6v4k2t7r00000';

    /**
     * @return iterable<string, array{Command<mixed>, string}>
     */
    public static function refusedInput(): iterable
    {
        $longTitle = str_repeat('é', Plan::TITLE_CHARACTER_LIMIT + 1);
        $longNote = str_repeat('é', Plan::NOTE_CHARACTER_LIMIT + 1);

        yield 'a long plan title' => [new CreatePlanCommand($longTitle, 'Brief', PlanType::Build), 'title'];

        yield 'a two-line plan title' => [new CreatePlanCommand("Release\nnow", 'Brief', PlanType::Build), 'title'];

        yield 'an empty plan title' => [new CreatePlanCommand('', 'Brief', PlanType::Build), 'title'];

        yield 'a long plan brief' => [
            new CreatePlanCommand('Release', str_repeat('é', Plan::BRIEF_CHARACTER_LIMIT + 1), PlanType::Build),
            'brief',
        ];

        yield 'a long edited title' => [new EditPlanCommand(self::PLAN_ID, 1, $longTitle), 'title'];

        yield 'a long phase title' => [new AddPhaseCommand(self::PLAN_ID, $longTitle), 'title'];

        yield 'a long cancel reason' => [new CancelPlanCommand(self::PLAN_ID, 1, $longNote), 'reason'];

        yield 'an empty finish note' => [new FinishPlanCommand(self::PLAN_ID, 1, ''), 'note'];

        yield 'a long finish note' => [new FinishPlanCommand(self::PLAN_ID, 1, $longNote), 'note'];
    }

    /**
     * @param  Command<mixed>  $command
     */
    #[DataProvider('refusedInput')]
    public function test_input_past_its_limit_is_refused_naming_the_field(Command $command, string $field): void
    {
        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run($command),
            CommandInputInvalid::class,
            "{$field}:",
        );

        $this->assertSame(0, Plan::query()->count());
    }

    public function test_a_title_and_brief_at_their_limits_create_the_plan(): void
    {
        $title = str_repeat('é', Plan::TITLE_CHARACTER_LIMIT);
        $brief = str_repeat('é', Plan::BRIEF_CHARACTER_LIMIT);

        $planId = $this->app->make(CommandBus::class)->run(new CreatePlanCommand($title, $brief, PlanType::Build));

        $this->assertSame($title, Plan::query()->findOrFail($planId)->title);
    }
}
