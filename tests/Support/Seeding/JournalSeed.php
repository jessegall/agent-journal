<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Commands\Inboxes\InstallInboxes\InstallInboxesCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\JournalCommands;
use App\Enums\Accounts\CommandEntry;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Inboxes\Inbox;
use App\Models\Messages\Message;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use App\Support\Command;
use App\Support\StartSessions;
use Illuminate\Contracts\Auth\Factory as AuthFactory;
use Illuminate\Contracts\Foundation\Application;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\OpensDriverRuntimes;
use Tests\Support\OpensPairChats;
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
    use OpensDriverRuntimes;
    use OpensPairChats;
    use RunsKeyedCommands;
    use StartsAgentRequests;
    use WritesInboxMessages;

    /**
     * @var array<string, Inbox>
     */
    private array $chats = [];

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

    private string|null $acting = null;

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
     * The journal's named inboxes, the main inbox among them, installed as the journal installs them.
     */
    public function installInboxes(): self
    {
        $this->runAsJournal(CommandEntry::HostControl, 'inbox install', new InstallInboxesCommand());

        return $this;
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
     * An agent of the local project on the profile, running one session started as the journal starts one, with its
     * stack and its driver's runtime, and a personal inbox.
     */
    public function agent(string $name, string $profile = 'main-agent'): self
    {
        $agent = Agent::create($name, $profile, TestProjects::local());
        $this->app->make(CurrentActorSetter::class)->clear();
        $session = $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;
        $this->openDriverRuntime($session);
        $this->agents[$name] = $agent;
        $this->sessions[$name] = $session;
        $this->inboxOf(ActorIdentity::of($agent));

        return $this->acting === null ? $this : $this->actAs($this->acting);
    }

    /**
     * The pair chat of the two users or agents of these names, both attached to it.
     */
    public function chat(string $first, string $second): self
    {
        $this->chats[self::chatKey($first, $second)] = $this->pairChat($this->actorCalled($first), $this->actorCalled($second));

        return $this;
    }

    /**
     * Starts a fresh request as the user or agent of this name, the actor of every command run after; a user's request
     * is signed in as that user.
     */
    public function actAs(string $name): self
    {
        $this->app->forgetScopedInstances();
        $this->acting = $name;

        if (array_key_exists($name, $this->agents)) {
            $this->app->make(AuthFactory::class)->guard()->forgetUser();
            $this->startRequestAs($this->agents[$name]->id, $this->sessions[$name]->id);

            return $this;
        }

        $this->app->make(AuthFactory::class)->guard()->setUser($this->userCalled($name));
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

    /**
     * Runs the command as the journal itself does, from the entry and under the trusted entry its listener names.
     */
    public function runAsJournal(CommandEntry $entry, string $trustedEntry, Command $command): mixed
    {
        return $this->app->make(JournalCommands::class)->runAsJournal($entry, $trustedEntry, $command);
    }

    /**
     * A message the user or agent of this name posts to the inbox, under the inbox's next number.
     */
    public function post(string $sender, Inbox $inbox, string $body): Message
    {
        return $this->postTo($inbox, $this->agents[$sender] ?? $this->userCalled($sender), $body);
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
    public function inboxCalled(string $name): Inbox
    {
        return $this->inboxOf($this->actorCalled($name));
    }

    public function chatOf(string $first, string $second): Inbox
    {
        return $this->chats[self::chatKey($first, $second)] ?? throw SeedMissing::named('chat', "{$first} and {$second}");
    }

    /**
     * The user or agent of this name as the journal names an actor.
     */
    public function actorCalled(string $name): ActorIdentity
    {
        return ActorIdentity::of($this->agents[$name] ?? $this->userCalled($name));
    }

    private static function chatKey(string $first, string $second): string
    {
        $names = [$first, $second];
        sort($names);

        return implode('|', $names);
    }

    private function makeUser(string $name): User
    {
        $user = User::factory()->create(['name' => $name]);
        $this->users[$name] = $user;
        $this->inboxOf(ActorIdentity::of($user));

        return $user;
    }
}
