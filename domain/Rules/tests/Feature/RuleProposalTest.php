<?php

declare(strict_types=1);

namespace Domain\Rules\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandAdmissionRefused;
use Domain\Rules\Commands\ApproveRule;
use Domain\Rules\Commands\DenyRule;
use Domain\Rules\Commands\ProposeRule;
use Domain\Rules\Commands\RemoveRule;
use Domain\Rules\Contracts\RuleDetailsResolver;
use Domain\Rules\Enums\RuleState;
use Domain\Rules\Models\Rule;
use Domain\Rules\Support\ActiveRules;
use Domain\Rules\Tests\TestCase;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;

/**
 * A proposal keeps its reason, the rule it would replace and its proposer, and does not hold until approved; removal,
 * approval and denial stay with the user.
 */
final class RuleProposalTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = ['rules', 'agents', 'agent_sessions', 'start_tokens', 'command_receipts'];

    public function test_a_proposal_stores_its_reason_replaced_rule_and_proposer_and_is_not_enforced(): void
    {
        $start = TestStart::start();
        $old = Rule::holding('Old rule.');
        $this->startRequestAs($start->agent->id, $start->session->id);

        $id = $this->app->make(CommandBus::class)->run(
            new ProposeRule('New rule.', 'The old one is too vague.', $old->id),
        );

        $details = $this->app->make(RuleDetailsResolver::class)->rule($id);
        $this->assertSame(
            [RuleState::Proposed, 'The old one is too vague.', ActorType::Agent, $start->agent->id, $old->number],
            [
                $details->state,
                $details->reason,
                $details->proposerType,
                $details->proposerId,
                $details->replacesRuleNumber,
            ],
        );
        $this->assertSame(["Rule {$old->id}: Old rule."], $this->app->make(ActiveRules::class)->reminders());
        $this->assertSame(1, $this->app->make(RuleDetailsResolver::class)->activeCount());
    }

    public function test_an_agent_is_refused_removal_approval_and_denial(): void
    {
        $start = TestStart::start();
        $active = Rule::holding('Held rule.');
        $proposed = Rule::proposed('Proposed rule.', 'A reason.', null, ActorContext::forUser(TestIds::of(7)));
        $this->startRequestAs($start->agent->id, $start->session->id);
        $bus = $this->app->make(CommandBus::class);

        $this->assertThrows(fn () => $bus->run(new RemoveRule($active->id)), CommandAdmissionRefused::class);
        $this->assertThrows(fn () => $bus->run(new ApproveRule($proposed->id)), CommandAdmissionRefused::class);
        $this->assertThrows(fn () => $bus->run(new DenyRule($proposed->id)), CommandAdmissionRefused::class);

        $this->assertSame(
            [RuleState::Active, RuleState::Proposed],
            [$active->fresh()?->state, $proposed->fresh()?->state],
        );
    }

    public function test_the_user_removes_a_rule(): void
    {
        $active = Rule::holding('Held rule.');
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(7)),
            new OwnerAuthority('test'),
        );

        $this->app->make(CommandBus::class)->run(new RemoveRule($active->id));

        $this->assertSame(RuleState::Removed, $active->fresh()?->state);
    }
}
