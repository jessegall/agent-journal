<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Messages\Message;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use App\Support\AssigneeIdentity;
use App\Support\StartSessions;
use Tests\Fixtures\Agents\TestSelections;

/**
 * The messaging fixtures a test of messages shares: the owner, two started agents and the helpers that act as each.
 */
trait MessagingFixtures
{
    use CommitsHookRows;
    use OpensPairChats;
    use WritesInboxMessages;

    public const array MESSAGING_TABLES = [
        'settings_records',
        'users',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'agent_runtimes',
        'driver_requests',
        'inboxes',
        'inbox_members',
        'assignments',
        'command_receipts',
        'messages',
        'message_reads',
        'questions',
        'links',
        'notification_occurrences',
        'notification_scopes',
        'notification_receipts',
        'notification_changes',
    ];

    protected User $owner;

    protected AgentSession $builder;

    protected AgentSession $reviewer;

    /**
     * The owner as the configured owner and two started agents, Builder and Reviewer, with the owner acting.
     */
    protected function setUpMessaging(): void
    {
        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->builder = $this->start('Builder');
        $this->reviewer = $this->start('Reviewer');
        $this->asOwner();
    }

    protected function asOwner(): void
    {
        $this->app->forgetScopedInstances();
        $this->journal->actAsUserId($this->owner->id);
    }

    protected function asAgent(AgentSession $session): void
    {
        $this->app->forgetScopedInstances();
        $this->journal->actAsAgentIds($session->agent_id, $session->id);
    }

    protected function ownerInboxId(): string
    {
        return $this->inboxOf(ActorIdentity::of($this->owner))->id;
    }

    protected function inboxIdOf(AgentSession $session): string
    {
        return $this->inboxOf($this->actorOf($session))->id;
    }

    /**
     * The pair chat inbox of the owner and the session's agent, both attached.
     */
    protected function pairInboxIdOf(AgentSession $session): string
    {
        return $this->pairChat(ActorIdentity::of($this->owner), $this->actorOf($session))->id;
    }

    protected function actorOf(AgentSession $session): ActorIdentity
    {
        return ActorIdentity::ofClass(Agent::class, $session->agent_id);
    }

    protected function assigneeOf(AgentSession $session): AssigneeIdentity
    {
        return AssigneeIdentity::ofActorIdentity($this->actorOf($session));
    }

    /**
     * The owner sends a message to an inbox it is attached to and is given its message id.
     */
    protected function ownerSends(string $inboxId, string $body): string
    {
        return $this->journal->run(new SendMessageCommand($inboxId, $body));
    }

    private function start(string $name): AgentSession
    {
        $agent = Agent::create($name, 'main-agent', $this->localProject());
        $session = $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;
        $this->journal->syntheticRuntime($session);
        $this->inboxOf(ActorIdentity::of($agent));

        return $session;
    }
}
