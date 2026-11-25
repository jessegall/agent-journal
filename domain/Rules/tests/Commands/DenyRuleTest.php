<?php

declare(strict_types=1);

namespace Domain\Rules\Tests\Commands;

use App\Exceptions\CommandAdmissionRefused;
use Domain\Rules\Commands\DenyRule\DenyRuleCommand;
use Domain\Rules\Enums\RuleStatus;
use Domain\Rules\Events\RuleDenied;
use Domain\Rules\Exceptions\RuleNotProposed;
use Domain\Rules\Models\Rule;
use Domain\Rules\Tests\Fixtures\RuleFixtures;
use Domain\Rules\Tests\TestCase;
use Illuminate\Support\Facades\Event;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;

/**
 * The user denies a proposed rule, which never holds; an agent may not deny one, and a rule that already holds cannot
 * be denied.
 */
#[TestsCommand(DenyRuleCommand::class)]
final class DenyRuleTest extends TestCase
{
    use RefreshHookDatabase;

    private Rule $proposed;

    protected function setUp(): void
    {
        parent::setUp();

        Event::fake([RuleDenied::class]);
        $this->journal->agent('Planner')->owner();

        $this->proposed = $this->journal->fixtures(RuleFixtures::class)
            ->proposedRule('Proposed', 'No phase waits on the user.', 'Planner', 'Agents keep forgetting it.')
            ->ruleCalled('Proposed');
    }

    public function test_a_denied_rule_never_holds_and_says_so(): void
    {
        $this->journal->run(new DenyRuleCommand($this->proposed->id));

        $this->assertSame(RuleStatus::Denied, $this->proposed->refresh()->status);
        Event::assertDispatchedTimes(RuleDenied::class, 1);
    }

    public function test_an_agent_may_not_deny_and_the_rule_stays_proposed(): void
    {
        $this->journal->actAs('Planner');

        $this->assertThrows(fn () => $this->journal->run(new DenyRuleCommand($this->proposed->id)), CommandAdmissionRefused::class);
        $this->assertSame(RuleStatus::Proposed, $this->proposed->refresh()->status);
    }

    public function test_a_rule_that_holds_cannot_be_denied(): void
    {
        $active = $this->journal->fixtures(RuleFixtures::class)
            ->holdingRule('Held', 'Held rule.', proposer: 'Planner', approver: 'Owner')
            ->ruleCalled('Held');

        $this->assertThrows(fn () => $this->journal->run(new DenyRuleCommand($active->id)), RuleNotProposed::class);
        $this->assertSame(RuleStatus::Active, $active->refresh()->status);
    }
}
