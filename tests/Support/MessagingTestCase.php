<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Commands\Messages\AskMessage\AskMessageCommand;
use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Enums\Assignments\ActorType;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Messages\Message;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use App\Support\AssigneeIdentity;
use App\Support\Assignment;
use App\Support\ProvedClaims;
use App\Support\StartSessions;
use Tests\Fixtures\Agents\TestSelections;
use Tests\TestCase;

/**
 * The cast of a messaging test: the installation's owner and two running agents, Builder and Reviewer, each with its
 * own inbox, and a way to run a command on the bus as one of them.
 */
abstract class MessagingTestCase extends TestCase
{
    use CommitsHookRows;
    use OpensDriverRuntimes;
    use RunsKeyedCommands;
    use StartsAgentRequests;
    use WritesInboxMessages;

    protected const array TABLES = [
        'settings_records',
        'users',
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'agent_runtimes',
        'driver_requests',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'command_receipts',
        'messages',
        'message_attentions',
        'links',
        'notification_occurrences',
        'notification_scopes',
        'notification_receipts',
        'notification_changes',
    ];

    protected User $owner;

    protected AgentSession $builder;

    protected AgentSession $reviewer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->builder = $this->start('Builder');
        $this->reviewer = $this->start('Reviewer');
        $this->asOwner();
    }

    protected function asOwner(): void
    {
        $this->app->forgetScopedInstances();
        $this->startUserRequestAs($this->owner->id);
    }

    protected function asAgent(AgentSession $session): void
    {
        $this->app->forgetScopedInstances();
        $this->startRequestAs($session->agent_id, $session->id);
    }

    protected function ownerInboxId(): string
    {
        return $this->inboxOf(ActorIdentity::of($this->owner))->inboxId();
    }

    protected function inboxIdOf(AgentSession $session): string
    {
        return $this->inboxOf($this->actorOf($session))->inboxId();
    }

    protected function actorOf(AgentSession $session): ActorIdentity
    {
        return new ActorIdentity(ActorType::Agent, $session->agent_id);
    }

    protected function assigneeOf(AgentSession $session): AssigneeIdentity
    {
        return AssigneeIdentity::ofActorIdentity($this->actorOf($session));
    }

    /**
     * The owner asks a question to the inbox and is given its message id.
     */
    protected function ownerAsks(string $inboxId, string $body): string
    {
        return $this->runOnBus(new AskMessageCommand($this->ownerInboxId(), $inboxId, $body));
    }

    /**
     * The owner sends a note to the inbox and is given its message id.
     */
    protected function ownerSends(string $inboxId, string $body): string
    {
        return $this->runOnBus(new SendMessageCommand($this->ownerInboxId(), $inboxId, $body));
    }

    /**
     * The claims that still stand on the message, keyed by its id.
     *
     * @return array<string, Assignment>
     */
    protected function claimsOn(string $messageId): array
    {
        return $this->app->make(ProvedClaims::class)->validClaimsOn(Message::linkType(), [$messageId]);
    }

    private function start(string $name): AgentSession
    {
        $agent = Agent::create($name, 'main-agent');
        $session = $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;
        $this->openDriverRuntime($session);
        $this->inboxOf(ActorIdentity::of($agent));

        return $session;
    }
}
