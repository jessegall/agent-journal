<?php

declare(strict_types=1);

namespace Domain\Rules\Tests\Commands;

use App\Exceptions\CommandInputInvalid;
use App\Models\Agents\Agent;
use Domain\Rules\Commands\ProposeRule\ProposeRuleCommand;
use Domain\Rules\Enums\RuleStatus;
use Domain\Rules\Exceptions\RuleMissing;
use Domain\Rules\Models\Rule;
use Domain\Rules\Support\ActiveRules;
use Domain\Rules\Tests\Fixtures\RuleFixtures;
use Domain\Rules\Tests\TestCase;
use Illuminate\Support\Str;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestText;

/**
 * An agent proposes a rule: it keeps its text, reason, proposer and the rule it would replace, and holds only once
 * approved; a rule to replace that is not there, an empty text or reason and one past its limit are refused, while a
 * text and reason at their limits are kept.
 */
#[TestsCommand(ProposeRuleCommand::class)]
final class ProposeRuleTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Planner')->actAs('Planner');
    }

    /**
     * @return iterable<string, array{ProposeRuleCommand, string}>
     */
    public static function refusedProposals(): iterable
    {
        yield 'a long text' => [
            new ProposeRuleCommand(str_repeat('é', Rule::TEXT_CHARACTER_LIMIT + 1), 'Reason'),
            'text',
        ];

        yield 'an empty text' => [
            new ProposeRuleCommand('', 'Reason'),
            'text',
        ];

        yield 'a long reason' => [
            new ProposeRuleCommand('Text', str_repeat('é', Rule::REASON_CHARACTER_LIMIT + 1)),
            'reason',
        ];

        yield 'an empty reason' => [
            new ProposeRuleCommand('Text', ''),
            'reason',
        ];
    }

    public function test_a_proposal_keeps_its_reason_proposer_and_replaced_rule_and_does_not_hold(): void
    {
        $old = $this->journal->fixtures(RuleFixtures::class)
            ->holdingRule('Old', 'Old rule.', proposer: 'Planner', approver: 'Owner')
            ->ruleCalled('Old');

        $ruleId = $this->journal->run(new ProposeRuleCommand('New rule.', 'The old one is too vague.', $old->id));

        $rule = Rule::query()->findOrFail($ruleId);

        $this->assertSame(
            [
                RuleStatus::Proposed,
                'The old one is too vague.',
                $old->id,
                Agent::storedType(),
                $this->journal->agentCalled('Planner')->id,
            ],
            [
                $rule->status,
                $rule->reason,
                $rule->replaces_rule_id,
                $rule->proposer_type,
                $rule->proposer_id,
            ],
        );

        $this->assertSame(
            ["Rule {$old->number}: Old rule."],
            array_map(TestText::words(...), $this->app->make(ActiveRules::class)->reminders()),
        );
    }

    public function test_a_rule_to_replace_that_is_not_there_is_refused(): void
    {
        $this->assertThrows(
            fn () => $this->journal->run(new ProposeRuleCommand('New rule.', 'A reason.', (string) Str::ulid())),
            RuleMissing::class,
        );

        $this->assertSame(0, Rule::query()->count());
    }

    #[DataProvider('refusedProposals')]
    public function test_a_proposal_past_its_limit_or_empty_is_refused_naming_the_field(ProposeRuleCommand $proposal, string $field): void
    {
        $this->assertThrows(fn () => $this->journal->run($proposal), CommandInputInvalid::class, "{$field}:");

        $this->assertSame(0, Rule::query()->count());
    }

    public function test_a_text_and_reason_at_their_limits_are_proposed(): void
    {
        $text = str_repeat('é', Rule::TEXT_CHARACTER_LIMIT);

        $ruleId = $this->journal->run(new ProposeRuleCommand($text, str_repeat('é', Rule::REASON_CHARACTER_LIMIT)));

        $this->assertSame($text, Rule::query()->findOrFail($ruleId)->text);
    }
}
