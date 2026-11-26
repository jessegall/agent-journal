<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Messages\Commands\SendMessage\SendMessageCommand;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Messages\Message;
use App\Support\ActorReference;
use App\Support\AssigneeIdentity;

/**
 * The messaging fixtures a test of messages shares: the owner, two started agents and the helpers that act as each.
 */
trait MessagingFixtures
{
    use CommitsHookRows;

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
        $this->owner = $this->journal->owner()->ownerUser();
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
        return $this->journal->inboxes()->personal(ActorReference::of($this->owner))->id;
    }

    protected function inboxIdOf(AgentSession $session): string
    {
        return $this->journal->inboxes()->personal($this->actorOf($session))->id;
    }

    /**
     * The pair chat inbox of the owner and the session's agent, both attached.
     */
    protected function pairInboxIdOf(AgentSession $session): string
    {
        return $this->journal->inboxes()->shared(ActorReference::of($this->owner), $this->actorOf($session))->id;
    }

    protected function actorOf(AgentSession $session): ActorReference
    {
        return ActorReference::ofClass(Agent::class, $session->agent_id);
    }

    protected function assigneeOf(AgentSession $session): AssigneeIdentity
    {
        return AssigneeIdentity::ofActorReference($this->actorOf($session));
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
        $session = $this->journal->idleAgent($name)->startSession($name, $name)->sessionCalled($name);
        $this->journal->syntheticRuntime($session);

        return $session;
    }
}
