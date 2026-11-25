<?php

declare(strict_types=1);

namespace Domain\Rules\Tests\Commands;

use App\Exceptions\CommandAdmissionRefused;
use App\Support\ActorContext;
use Domain\Rules\Commands\ApproveRule\ApproveRuleCommand;
use Domain\Rules\Commands\DenyRule\DenyRuleCommand;
use Domain\Rules\Enums\RuleStatus;
use Domain\Rules\Events\RuleApproved;
use Domain\Rules\Exceptions\RuleNotProposed;
use Domain\Rules\Models\Rule;
use Domain\Rules\Support\ActiveRules;
use Domain\Rules\Tests\TestCase;
use Illuminate\Support\Facades\Event;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\SeedsJournal;
use Tests\Support\TestText;

/**
 * The user approves a proposed rule, which then holds; an agent may not approve one, and a rule already reviewed is
 * refused and stays as it was.
 */
final class ApproveRuleTest extends TestCase
{
    use RefreshHookDatabase;
    use SeedsJournal;

    private Rule $proposed;

    protected function setUp(): void
    {
        parent::setUp();

        Event::fake([RuleApproved::class]);
        $this->journal()->agent('Planner')->owner();
        $this->proposed = Rule::create(
            'No phase waits on the user.',
            'Agents keep forgetting it.',
            null,
            ActorContext::forAgent($this->journal()->agentCalled('Planner')->id),
        );
    }

    public function test_an_approved_rule_holds_and_says_so(): void
    {
        $this->journal()->run(new ApproveRuleCommand($this->proposed->id));

        $this->assertSame(RuleStatus::Active, $this->proposed->refresh()->status);
        $this->assertSame(
            ["Rule {$this->proposed->number}: No phase waits on the user."],
            array_map(TestText::words(...), $this->app->make(ActiveRules::class)->reminders()),
        );
        Event::assertDispatched(RuleApproved::class, fn (RuleApproved $event) => $event->ruleId === $this->proposed->id);
    }

    public function test_an_agent_may_not_approve_and_the_rule_stays_proposed(): void
    {
        $this->journal()->actAs('Planner');

        $this->assertThrows(fn () => $this->journal()->run(new ApproveRuleCommand($this->proposed->id)), CommandAdmissionRefused::class);
        $this->assertSame(RuleStatus::Proposed, $this->proposed->refresh()->status);
        Event::assertNotDispatched(RuleApproved::class);
    }

    public function test_a_rule_already_reviewed_is_refused_and_stays_as_it_was(): void
    {
        $this->journal()->run(new DenyRuleCommand($this->proposed->id));

        $this->assertThrows(
            fn () => $this->journal()->run(new ApproveRuleCommand($this->proposed->id)),
            RuleNotProposed::class,
        );
        $this->assertSame(RuleStatus::Denied, $this->proposed->refresh()->status);
    }
}
