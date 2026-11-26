<?php

declare(strict_types=1);

namespace Domain\Rules\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Events\Web\PageChanged;
use App\Exceptions\CommandAdmissionRefused;
use App\Exceptions\CrossProjectEdge;
use App\Support\ActorReference;
use App\Support\UserChannel;
use App\Values\ProjectOwner;
use Domain\Rules\Commands\ApproveRule\ApproveRuleCommand;
use Domain\Rules\Commands\DenyRule\DenyRuleCommand;
use Domain\Rules\Enums\RuleStatus;
use Domain\Rules\Events\RuleApproved;
use Domain\Rules\Exceptions\RuleNotProposed;
use Domain\Rules\Models\Rule;
use Domain\Rules\Support\ActiveRules;
use Domain\Rules\Tests\Fixtures\RuleFixtures;
use Domain\Rules\Tests\TestCase;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\Support\TestProjects;
use Tests\Support\TestText;

/**
 * The user approves a proposed rule for its project or as Global, and it then holds; an agent may not approve one, a
 * rule already reviewed is refused and stays as it was, and a replacement must end with its replaced rule's owner.
 */
#[TestsCommand(ApproveRuleCommand::class)]
final class ApproveRuleTest extends TestCase
{
    use CommitsHookRows;

    private Rule $proposed;

    private const array TABLES = [
        'rules',
        'users',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        Event::fake([RuleApproved::class]);
        $this->journal->agent('Planner')->owner();

        $this->proposed = $this->journal->fixtures(RuleFixtures::class)
            ->proposedRule('Proposed', 'No phase waits on the user.', 'Planner', 'Agents keep forgetting it.')
            ->ruleCalled('Proposed');
    }

    public function test_an_approved_rule_holds_and_says_so(): void
    {
        $this->journal->run($this->approval($this->proposed, TestProjects::localOwner()));

        $this->assertSame(RuleStatus::Active, $this->proposed->refresh()->status);

        $this->assertSame(
            ["Rule {$this->proposed->number}: No phase waits on the user."],
            array_map(TestText::words(...), $this->app->make(ActiveRules::class)->reminders()),
        );

        Event::assertDispatched(
            RuleApproved::class,
            fn (RuleApproved $event) => $event->ruleId === $this->proposed->id,
        );
    }

    public function test_an_agent_may_not_approve_and_the_rule_stays_proposed(): void
    {
        $this->journal->actAs('Planner');

        $this->assertThrows(
            fn () => $this->journal->run($this->approval($this->proposed, TestProjects::localOwner())),
            CommandAdmissionRefused::class,
        );

        $this->assertSame(RuleStatus::Proposed, $this->proposed->refresh()->status);
        Event::assertNotDispatched(RuleApproved::class);
    }

    public function test_a_rule_already_reviewed_is_refused_and_stays_as_it_was(): void
    {
        $this->journal->run(new DenyRuleCommand($this->proposed->id));

        $this->assertThrows(
            fn () => $this->journal->run($this->approval($this->proposed, TestProjects::localOwner())),
            RuleNotProposed::class,
        );

        $this->assertSame(RuleStatus::Denied, $this->proposed->refresh()->status);
    }

    public function test_an_approved_rule_tells_the_owner_once_on_their_private_channel(): void
    {
        Event::fake([PageChanged::class]);

        $rule = Rule::create(
            'Every phase ends with its tests.',
            'Agents keep forgetting it.',
            null,
            ActorReference::forUser(TestIds::of(7)),
            TestProjects::localOwner(),
        );

        $this->app->make(CommandBus::class)->run($this->approval($rule, TestProjects::localOwner()));

        Event::assertDispatchedTimes(PageChanged::class, 1);

        Event::assertDispatched(PageChanged::class, fn (PageChanged $change) => $change->userIds === [
            $this->journal->ownerUser()->id,
        ]
            && $change->broadcastOn()[0]->name === 'private-'.UserChannel::nameFor($this->journal->ownerUser()->id)
            && $change->broadcastWith() === []);
    }

    public function test_the_owner_approves_an_agents_proposal_as_global(): void
    {
        $this->journal->project('Shop')->agent('Shopper', project: 'Shop');

        $proposal = $this->journal->fixtures(RuleFixtures::class)
            ->proposedRule('Shop rule', 'Ship on Fridays.', 'Shopper')
            ->ruleCalled('Shop rule');

        $this->journal->run($this->approval($proposal, ProjectOwner::global()));

        $approved = Rule::query()->findOrFail($proposal->id);
        $this->assertSame([RuleStatus::Active, null], [$approved->status, $approved->project_id]);
    }

    public function test_a_replacement_ending_with_another_owner_than_its_replaced_rule_is_refused(): void
    {
        $global = $this->journal->fixtures(RuleFixtures::class)
            ->proposedRule('Global', 'Every phase ends with its tests.', 'Planner')
            ->ruleCalled('Global');

        $global->approveBy($this->journal->actorCalled('Owner'), ProjectOwner::global());

        $replacement = Rule::create(
            'Every phase ends with its tests and its checks.',
            'The checks were forgotten.',
            $global->id,
            ActorReference::of($this->journal->agentCalled('Planner')),
            TestProjects::localOwner(),
        );

        $this->assertThrows(
            fn () => $this->journal->run($this->approval($replacement, TestProjects::localOwner())),
            CrossProjectEdge::class,
        );

        $this->assertSame(RuleStatus::Proposed, $replacement->refresh()->status);
    }

    private function approval(Rule $rule, ProjectOwner $owner): ApproveRuleCommand
    {
        return new ApproveRuleCommand($rule->id, $owner->key());
    }
}
