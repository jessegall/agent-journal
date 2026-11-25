<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Inboxes\Inbox;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use Illuminate\Contracts\Foundation\Application;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestProjects;
use Tests\Support\WritesInboxMessages;

/**
 * The start position of a test, written as the journal it needs: its owner, other users and agents, each with the
 * personal inbox the journal gives it, and who acts; each call makes its rows at once, and run() sends a command as
 * the actor in place, under a request key of its own.
 */
final class JournalSeed
{
    use RunsKeyedCommands;
    use StartsAgentRequests;
    use WritesInboxMessages {
        inboxOf as private personalInbox;
    }

    /**
     * @var array<string, User>
     */
    private array $users = [];

    /**
     * @var array<string, Agent>
     */
    private array $agents = [];

    /**
     * @var array<string, AgentSession>
     */
    private array $sessions = [];

    private User|null $owner = null;

    public function __construct(private readonly Application $app) {}

    /**
     * The journal's owner, a real user whose access settings the journal holds, acting from here on.
     */
    public function owner(string $name = 'Owner'): self
    {
        $this->owner = $this->makeUser($name);
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));

        return $this->actAs($name);
    }

    /**
     * Another user of the journal, with a personal inbox.
     */
    public function user(string $name): self
    {
        $this->makeUser($name);

        return $this;
    }

    /**
     * An agent of the local project on the profile, with one session and a personal inbox.
     */
    public function agent(string $name, string $profile = 'main-agent'): self
    {
        $agent = Agent::create($name, $profile, TestProjects::local());
        $session = new AgentSession()->forceFill(TestSelections::sessionColumns());
        $session->agent_id = $agent->id;
        $session->save();
        $this->agents[$name] = $agent;
        $this->sessions[$name] = $session;
        $this->personalInbox(ActorIdentity::of($agent));

        return $this;
    }

    /**
     * Starts a fresh request as the user or agent of this name, the actor of every command run after.
     */
    public function actAs(string $name): self
    {
        $this->app->forgetScopedInstances();

        if (array_key_exists($name, $this->agents)) {
            $this->startRequestAs($this->agents[$name]->id, $this->sessions[$name]->id);

            return $this;
        }

        $this->startUserRequestAs($this->userCalled($name)->id);

        return $this;
    }

    /**
     * Runs the command as the actor in place, under a request key of its own or the one given to send it again.
     */
    public function run(object $command, string|null $requestKey = null): mixed
    {
        return $this->runOnBus($command, $requestKey);
    }

    public function ownerUser(): User
    {
        return $this->owner ?? throw SeedMissing::owner();
    }

    public function userCalled(string $name): User
    {
        return $this->users[$name] ?? throw SeedMissing::named('user', $name);
    }

    public function agentCalled(string $name): Agent
    {
        return $this->agents[$name] ?? throw SeedMissing::named('agent', $name);
    }

    public function sessionOf(string $agentName): AgentSession
    {
        return $this->sessions[$agentName] ?? throw SeedMissing::named('agent', $agentName);
    }

    /**
     * The personal inbox of the user or agent of this name.
     */
    public function inboxOf(string $name): Inbox
    {
        return $this->personalInbox(ActorIdentity::of($this->agents[$name] ?? $this->userCalled($name)));
    }

    private function makeUser(string $name): User
    {
        $user = User::factory()->create(['name' => $name]);
        $this->users[$name] = $user;
        $this->personalInbox(ActorIdentity::of($user));

        return $user;
    }
}
