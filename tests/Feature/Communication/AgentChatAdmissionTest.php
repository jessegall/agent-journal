<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\Agents\RetireAgent\RetireAgentCommand;
use App\Models\Agents\Agent;
use App\Support\ActorIdentity;
use App\Support\AgentChatAccessService;
use App\Support\ChatInboxes;
use Carbon\CarbonImmutable;
use Domain\Chat\Commands\AddChatParticipant\AddChatParticipantCommand;
use Domain\Chat\Commands\CreateGroupChat\CreateGroupChatCommand;
use Domain\Chat\Exceptions\ChatMembershipRefused;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Support\ChatAdmissionPolicy;
use Domain\Chat\Support\ChatInbox;
use Tests\Support\MessagingTestCase;

/**
 * An agent joins a chat only when its operator allowed it for that inviter: it is then a candidate and may be added,
 * another agent never appears and is refused by id, withdrawing it ends its chats, and retiring it takes it out too.
 */
final class AgentChatAdmissionTest extends MessagingTestCase
{
    private string $inboxId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(AgentChatAccessService::class)->allow(
            $this->builder->agent_id,
            null,
            [$this->owner->id],
            ActorIdentity::system(),
            CarbonImmutable::now(),
        );
        $this->asOwner();
        $this->inboxId = $this->runOnBus(new CreateGroupChatCommand('Design', []));
    }

    public function test_an_allowed_agent_is_a_candidate_and_joins_and_another_is_refused(): void
    {
        $candidates = $this->app->make(ChatAdmissionPolicy::class)
            ->candidates(ActorIdentity::of($this->owner), Conversation::forInbox($this->inboxId));

        $this->assertContains($this->builder->agent_id, array_map(fn ($candidate) => $candidate->id, $candidates));
        $this->assertNotContains($this->reviewer->agent_id, array_map(fn ($candidate) => $candidate->id, $candidates));

        $this->runOnBus(new AddChatParticipantCommand($this->inboxId, "agent:{$this->builder->agent_id}"));
        $this->assertTrue($this->isMember($this->builder->agent_id));

        $this->expectException(ChatMembershipRefused::class);
        $this->runOnBus(new AddChatParticipantCommand($this->inboxId, "agent:{$this->reviewer->agent_id}"));
    }

    public function test_withdrawing_or_retiring_the_agent_takes_it_out_of_the_chat(): void
    {
        $this->runOnBus(new AddChatParticipantCommand($this->inboxId, "agent:{$this->builder->agent_id}"));
        $this->app->make(AgentChatAccessService::class)->withdraw($this->builder->agent_id, null, CarbonImmutable::now());

        $this->assertFalse($this->isMember($this->builder->agent_id));

        $this->app->make(AgentChatAccessService::class)->allow(
            $this->builder->agent_id,
            null,
            [$this->owner->id],
            ActorIdentity::system(),
            CarbonImmutable::now(),
        );
        $this->runOnBus(new AddChatParticipantCommand($this->inboxId, "agent:{$this->builder->agent_id}"));
        $this->runOnBus(new RetireAgentCommand($this->builder->agent_id));

        $this->assertFalse($this->isMember($this->builder->agent_id));
    }

    private function isMember(string $agentId): bool
    {
        return $this->app->make(ChatInboxes::class)->isActiveMember(
            new ChatInbox($this->inboxId, 'Design'),
            ActorIdentity::ofClass(Agent::class, $agentId),
        );
    }
}
