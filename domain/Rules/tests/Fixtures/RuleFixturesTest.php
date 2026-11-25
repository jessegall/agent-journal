<?php

declare(strict_types=1);

namespace Domain\Rules\Tests\Fixtures;

use App\Exceptions\CommandAdmissionRefused;
use Domain\Rules\Commands\RemoveRule\RemoveRuleCommand;
use Domain\Rules\Events\RuleRemoved;
use Domain\Rules\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;

/**
 * A rule arranged to hold through the journal is approved by someone other than its proposer; an agent may not remove
 * it, it still holds after, and no removal is heard of, while its owner's removal ends it.
 */
final class RuleFixturesTest extends TestCase
{
    use RefreshHookDatabase;

    private RuleFixtures $rules;

    protected function setUp(): void
    {
        parent::setUp();

        $this->rules = $this->journal->agent('Planner')->user('Colleague')->owner()->fixtures(RuleFixtures::class)
            ->holdingRule('Held', 'Held rule.', proposer: 'Colleague', approver: 'Owner');
    }

    public function test_an_agent_may_not_remove_a_rule_and_it_still_holds(): void
    {
        $this->journal->observeEvents(RuleRemoved::class);

        $this->journal->assertRefused(
            CommandAdmissionRefused::class,
            fn () => $this->journal->runAs('Planner', new RemoveRuleCommand($this->rules->ruleCalled('Held')->id)),
        );

        $this->rules->assertHolds('Held');
        $this->journal->assertEventCount(RuleRemoved::class, 0);
    }

    public function test_the_owner_removes_the_rule(): void
    {
        $this->journal->runAs('Owner', new RemoveRuleCommand($this->rules->ruleCalled('Held')->id));

        $this->rules->assertRemoved('Held');
    }
}
