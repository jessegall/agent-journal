<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Support;

use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;

/**
 * A team inbox the owner and Builder are attached to, holding one message the owner sent, with Reviewer started but
 * outside it.
 */
trait OpensTeamInboxMessage
{
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
        $this->owner = $this->journal->owner()->ownerUser();
        $this->builder = $this->startedIds('Builder');
        $this->reviewer = $this->startedIds('Reviewer');
        $this->journal->actAsUserId($this->owner->id);

        $this->team = Inbox::create(Inbox::NAMED_PROVIDER, 'team', 'Team');
        $now = CarbonImmutable::now();
        InboxMember::create($this->team->id, ActorIdentity::of($this->owner), $now);
        InboxMember::create($this->team->id, ActorIdentity::ofClass(Agent::class, $this->builder[0]), $now);

        $this->messageId = $this->journal->run(new SendMessageCommand($this->team->id, 'Pin me.'));
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
        $this->journal->actAsAgentIds($agent[0], $agent[1]);
    }

    /**
     * @return array{string, string} the agent id and its session id, for a main agent started under its own name
     */
    private function startedIds(string $name): array
    {
        $session = $this->journal->idleAgent($name)->startSession($name, $name)->sessionCalled($name);

        return [
            $session->agent_id,
            $session->id,
        ];
    }
}
