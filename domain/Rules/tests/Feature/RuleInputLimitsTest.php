<?php

declare(strict_types=1);

namespace Domain\Rules\Tests\Feature;

use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandInputInvalid;
use Domain\Rules\Commands\ProposeRule;
use Domain\Rules\Models\Rule;
use Domain\Rules\Tests\TestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\ActsAsTestUser;
use Tests\Support\CommitsHookRows;

/**
 * A rule proposal refuses a text or a reason that is empty or past its limit with invalid_input, and proposes nothing.
 */
final class RuleInputLimitsTest extends TestCase
{
    use ActsAsTestUser;
    use CommitsHookRows;

    private const array TABLES = ['rules', 'command_receipts'];

    /**
     * @return iterable<string, array{ProposeRule, string}>
     */
    public static function refusedProposals(): iterable
    {
        yield 'a long text' => [new ProposeRule(str_repeat('é', Rule::TEXT_CHARACTER_LIMIT + 1), 'Reason'), 'text'];
        yield 'an empty text' => [new ProposeRule('', 'Reason'), 'text'];
        yield 'a long reason' => [new ProposeRule('Text', str_repeat('é', Rule::REASON_CHARACTER_LIMIT + 1)), 'reason'];
        yield 'an empty reason' => [new ProposeRule('Text', ''), 'reason'];
    }

    #[DataProvider('refusedProposals')]
    public function test_a_proposal_past_its_limit_is_refused_naming_the_field(ProposeRule $proposal, string $field): void
    {
        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run($proposal),
            CommandInputInvalid::class,
            "{$field}:",
        );
        $this->assertSame(0, Rule::query()->count());
    }

    public function test_a_text_and_reason_at_their_limits_are_proposed(): void
    {
        $text = str_repeat('é', Rule::TEXT_CHARACTER_LIMIT);

        $ruleId = $this->app->make(CommandBus::class)->run(
            new ProposeRule($text, str_repeat('é', Rule::REASON_CHARACTER_LIMIT)),
        );

        $this->assertSame($text, Rule::query()->findOrFail($ruleId)->text);
    }
}
