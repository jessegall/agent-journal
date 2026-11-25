<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Support;

use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Tests\Support\StartsMainAgents;

/**
 * A team inbox the owner and Builder are attached to, holding one message the owner sent, with Reviewer started but
 * outside it.
 */
trait OpensTeamInboxMessage
{
    use StartsMainAgents;

    private User $owner;

    /**
     * @var array{string, string}
     */
    private array $builder;

    /**
     * @var array{string, string}
     */
    private array $reviewer;

    private Inbox $team;

    private string $messageId;

    protected function setUpOpensTeamInboxMessage(): void
    {
        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->builder = $this->startMainAgent('Builder');
        $this->reviewer = $this->startMainAgent('Reviewer');
        $this->startUserRequestAs($this->owner->id);

        $this->team = Inbox::create(Inbox::NAMED_PROVIDER, 'team', 'Team');
        $now = CarbonImmutable::now();
        InboxMember::create($this->team->id, ActorIdentity::of($this->owner), $now);
        InboxMember::create($this->team->id, ActorIdentity::ofClass(Agent::class, $this->builder[0]), $now);

        $this->messageId = $this->runOnBus(new SendMessageCommand($this->team->id, 'Pin me.'));
    }

    /**
     * The agent attached to the team inbox leaves it and the next agent joins in its place.
     */
    private function replaceMember(string $leavingAgentId, string $joiningAgentId): void
    {
        $now = CarbonImmutable::now();
        $leaving = ActorIdentity::ofClass(Agent::class, $leavingAgentId);
        $member = InboxMember::findActive($this->team->id, $leaving);
        $this->assertNotNull($member);
        $member->leave($now);
        InboxMember::create($this->team->id, ActorIdentity::ofClass(Agent::class, $joiningAgentId), $now);
    }

    /**
     * @param  array{string, string}  $agent
     */
    private function asAgent(array $agent): void
    {
        $this->app->forgetScopedInstances();
        $this->startRequestAs($agent[0], $agent[1]);
    }
}
