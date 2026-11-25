<?php

declare(strict_types=1);

namespace Domain\Rules\Tests\Feature;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Enums\ActorType;
use App\Exceptions\CommandAdmissionRefused;
use App\Support\ActorContext;
use App\Values\OwnerAuthority;
use Domain\Rules\Commands\ApproveRule\ApproveRuleCommand;
use Domain\Rules\Commands\DenyRule\DenyRuleCommand;
use Domain\Rules\Commands\ProposeRule\ProposeRuleCommand;
use Domain\Rules\Commands\RemoveRule\RemoveRuleCommand;
use Domain\Rules\Contracts\RuleDetailsResolver;
use Domain\Rules\Enums\RuleState;
use Domain\Rules\Models\Rule;
use Domain\Rules\Support\ActiveRules;
use Domain\Rules\Tests\TestCase;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\HoldingRules;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;
use Tests\Support\TestText;

/**
 * A proposal keeps its reason, the rule it would replace and its proposer, and does not hold until approved; removal,
 * approval and denial stay with the user.
 */
final class RuleProposalTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = [
        'rules',
        'agents',
        'agent_sessions',
        'start_tokens',
        'command_receipts',
    ];

    public function test_a_proposal_stores_its_reason_replaced_rule_and_proposer_and_is_not_enforced(): void
    {
        $start = TestStart::start();
        $old = HoldingRules::create('Old rule.');
        $this->startRequestAs($start->agent->id, $start->session->id);

        $id = $this->app->make(CommandBus::class)->run(
            new ProposeRuleCommand('New rule.', 'The old one is too vague.', $old->id),
        );

        $details = $this->app->make(RuleDetailsResolver::class)->rule($id);

        $this->assertSame(
            [
                RuleState::Proposed,
                'The old one is too vague.',
                ActorType::Agent,
                $start->agent->id,
                $old->number,
            ],
            [
                $details->state,
                $details->reason,
                $details->proposerType,
                $details->proposerId,
                $details->replacesRuleNumber,
            ],
        );

        $reminders = array_map(TestText::words(...), $this->app->make(ActiveRules::class)->reminders());
        $this->assertSame(["Rule {$old->number}: Old rule."], $reminders);
        $this->assertSame(1, $this->app->make(RuleDetailsResolver::class)->activeCount());
    }

    public function test_an_agent_is_refused_removal_approval_and_denial(): void
    {
        $start = TestStart::start();
        $active = HoldingRules::create('Held rule.');
        $proposed = Rule::create('Proposed rule.', 'A reason.', null, ActorContext::forUser(TestIds::of(7)));
        $this->startRequestAs($start->agent->id, $start->session->id);
        $bus = $this->app->make(CommandBus::class);

        $this->assertThrows(fn () => $bus->run(new RemoveRuleCommand($active->id)), CommandAdmissionRefused::class);
        $this->assertThrows(fn () => $bus->run(new ApproveRuleCommand($proposed->id)), CommandAdmissionRefused::class);
        $this->assertThrows(fn () => $bus->run(new DenyRuleCommand($proposed->id)), CommandAdmissionRefused::class);

        $this->assertSame(
            [
                RuleState::Active,
                RuleState::Proposed,
            ],
            [
                $active->fresh()?->state,
                $proposed->fresh()?->state,
            ],
        );
    }

    public function test_the_user_removes_a_rule(): void
    {
        $active = HoldingRules::create('Held rule.');

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(7)),
            new OwnerAuthority('test'),
        );

        $this->app->make(CommandBus::class)->run(new RemoveRuleCommand($active->id));

        $this->assertSame(RuleState::Removed, $active->fresh()?->state);
    }
}
