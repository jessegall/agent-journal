<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Commands\Access\GrantEnvironmentAccess\GrantEnvironmentAccessCommand;
use App\Commands\Inboxes\InstallInboxes\InstallInboxesCommand;
use App\Contracts\Time\ServerClock;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Messages\InboxPermission;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Inboxes\Inbox;
use App\Models\Messages\Message;
use App\Models\Projects\Environment;
use App\Models\Projects\Project;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use App\Support\Command;
use App\Support\DomainRegistry;
use App\Support\StartedAgent;
use App\Support\StartSessions;
use App\Values\SelectedDriver;
use App\Values\StackTarget;
use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Foundation\Testing\TestCase;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\FakeServerClock;
use Tests\Support\TestProjects;

/**
 * The start position of a test, written as the journal it needs: its owner, other users and agents, each with the
 * personal inbox the journal gives it, and who acts; each call makes its rows at once, and run() sends a command as
 * the actor in place, under a request key of its own.
 */
final class JournalSeed
{
    private const string OWNER = 'The journal';

    use ArrangesProcessRuns;
    use ArrangesProfiles;
    use ArrangesSettings;
    use ArrangesSkills;
    use AssertsLinks;
    use AssertsMessages;
    use AssertsReceipts;
    use AssertsResults;
    use ObservesEvents;
    use OpensRuntimes;
    use PushesStates;
    use RunsCommands;
    use SendsRequests;
    use StartsScenarios;

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
     * @var array<string, StartedAgent> each start of an agent, by the name the test gave it
     */
    private array $starts = [];

    /**
     * @var array<string, list<string>> the names of each agent's starts, in the order they were made
     */
    private array $startNames = [];

    /**
     * @var array<string, string> the name of the agent of each start
     */
    private array $startAgents = [];

    /**
     * @var array<string, Project>
     */
    private array $projects = [];

    /**
     * @var array<string, Environment>
     */
    private array $environments = [];

    private User|null $owner = null;

    /**
     * @var array<string, true> the names of the users the owner admitted to the inboxes
     */
    private array $members = [];

    private readonly FixtureRequests $requests;

    private bool $hasStandInOwner = false;

    private readonly FixtureInboxes $inboxes;

    private readonly FixtureRegistry $registry;

    private FakeServerClock|null $serverClock = null;

    /**
     * @var array<string, Inbox> the inboxes a test kept under a name of its own
     */
    private array $remembered = [];

    public function __construct(private readonly Application $app, private readonly TestCase $test)
    {
        $this->requests = new FixtureRequests($app);
        $this->inboxes = new FixtureInboxes($app);
        $this->registry = new FixtureRegistry($app->make(DomainRegistry::class));
    }

    /**
     * The journal's owner, a real user whose access settings the journal holds, acting from here on.
     */
    public function owner(string $name = 'Owner'): self
    {
        if ($this->owner !== null) {
            throw FixtureRefused::secondOwner();
        }

        $this->owner = $this->makeUser($name);
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));

        return $this->actAs($this->owner->name);
    }

    /**
     * The application's own service of the type, for a fixture that reads through one.
     *
     * @template TService of object
     *
     * @param  class-string<TService>  $type
     * @return TService
     */
    public function service(string $type): object
    {
        return $this->app->make($type);
    }

    /**
     * The fixture builder a booted domain registered for the class, made once per test.
     *
     * @template TFixtures of object
     *
     * @param  class-string<TFixtures>  $fixtures
     * @return TFixtures
     */
    public function fixtures(string $fixtures): object
    {
        return $this->registry->fixtures($fixtures, $this);
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
     * stack and its driver's runtime, and a personal inbox; the start is named after the agent.
     */
    public function agent(string $name, string $profile = 'main-agent'): self
    {
        $this->idleAgent($name, $profile);
        $this->startSession($name, trim($name));
        $this->syntheticRuntime($name);

        return $this;
    }

    /**
     * An agent on the profile with its personal inbox and no session yet, in the local project or the named one.
     */
    public function idleAgent(string $name, string $profile = 'main-agent', string|null $project = null): self
    {
        $name = trim($name);
        $this->refuseTakenName($name);
        $home = $project === null ? TestProjects::local() : $this->projectCalled($project);
        $agent = Agent::create($name, $profile, $home);
        $this->inboxes->personal(ActorIdentity::of($agent));
        $this->agents[$name] = $agent;
        $this->startNames[$name] = [];

        return $this;
    }

    /**
     * One more session of the agent, started as the journal starts one, under a parent session when one is named.
     */
    public function startSession(
        string $agent,
        string $start,
        SelectedDriver|null $selection = null,
        string|null $parent = null,
    ): self {
        if (array_key_exists($start, $this->starts)) {
            throw FixtureRefused::occupiedAlias($start, 'start');
        }

        $model = $this->agentCalled($agent);
        $parentSession = $parent === null ? null : $this->sessionCalled($parent);
        $started = $this->requests->during(static fn () => null, fn () => $this->app->make(StartSessions::class)->start(
            $model,
            $selection ?? TestSelections::of('claude-code'),
            TestSelections::requestId(),
            $parentSession,
        ));
        $this->starts[$start] = $started;
        $this->startNames[$agent][] = $start;
        $this->startAgents[$start] = $agent;

        return $this;
    }

    /**
     * A project of the journal besides the local one.
     */
    public function project(string $name): self
    {
        if (array_key_exists($name, $this->projects)) {
            throw FixtureRefused::occupiedAlias($name, 'project');
        }

        $this->projects[$name] = Project::create(Str::slug($name), $name);

        return $this;
    }

    /**
     * An environment of the named project, or of the local project when none is named.
     */
    public function environment(string $name, string|null $project = null): self
    {
        if (array_key_exists($name, $this->environments)) {
            throw FixtureRefused::occupiedAlias($name, 'environment');
        }

        $this->environments[$name] = Environment::create(
            $project === null ? TestProjects::local() : $this->projectCalled($project),
            $name,
        );

        return $this;
    }

    /**
     * The owner admits the user of this name to the inboxes of the named environment.
     */
    public function grantEnvironment(string $environment, string $user): self
    {
        $this->grantAsOwner($this->userCalled($user), $this->environmentCalled($environment)->id);

        return $this;
    }

    /**
     * The pair chat of the two users or agents of these names, both attached to it.
     */
    public function chat(string $first, string $second): self
    {
        $one = $this->actorCalled($first);
        $other = $this->actorCalled($second);

        if ($one->isSameAs($other)) {
            throw FixtureRefused::selfChat($first);
        }

        $key = FixtureInboxes::pairKey($one, $other);

        if (array_key_exists($key, $this->chats)) {
            throw FixtureRefused::occupiedAlias("{$first} and {$second}", 'chat');
        }

        $this->chats[$key] = $this->inboxes->pairChat($one, $other);

        return $this;
    }

    /**
     * Starts a fresh request as the user or agent of this name, the actor of every command run after; a user's request
     * is signed in as that user.
     */
    public function actAs(string $name): self
    {
        if (array_key_exists($name, $this->agents)) {
            $session = $this->sessionOf($name);
            $this->app->forgetScopedInstances();
            $this->requests->asAgent($session->agent_id, $session->id);

            return $this;
        }

        $user = $this->userCalled($name);
        $this->app->forgetScopedInstances();
        $this->requests->asUser($user);

        return $this;
    }

    /**
     * The owner admits the user of this name to the journal's inboxes, as the owner's own grant does.
     */
    public function admitInboxMember(string $name): self
    {
        $this->grantAsOwner($this->userCalled($name), null);
        $this->members[$name] = true;

        return $this;
    }

    /**
     * Acts as the admitted user of this name, signed in under the authority an inbox member's sign-in gives it.
     */
    public function actAsInboxMember(string $name): self
    {
        if (! array_key_exists($name, $this->members)) {
            throw FixtureRefused::missingAlias('admitted inbox member', $name, self::OWNER);
        }

        $this->requests->asInboxMember($this->userCalled($name));

        return $this;
    }

    /**
     * Acts as no one: no user signed in and no actor in place.
     */
    public function asGuest(): self
    {
        $this->requests->asGuest();

        return $this;
    }

    /**
     * Acts as the agent of a stack target a test made itself, under the authority its start gives it, keeping what the
     * request bound in its scope.
     */
    public function actAsAgentOf(StackTarget $target): self
    {
        $this->requests->asAgent($target->agentId, $target->sessionId);

        return $this;
    }

    /**
     * Acts as a user known only by its id, with no one signed in, for an id the journal may not hold; while the journal
     * has no owner, the first user to act by id stands in as the owner, as the tests that act by id expect, and a user
     * acting by id after it is another user.
     */
    public function actAsUserId(string $userId): self
    {
        if ($this->owner === null && ! $this->hasStandInOwner) {
            $this->app->instance(AccessSettings::class, new AccessSettings($userId));
            $this->hasStandInOwner = true;
        }

        $this->requests->asUserId($userId);

        return $this;
    }

    /**
     * Acts as an agent known only by its id, which need not exist, with no session bound.
     */
    public function actAsAgentId(string $agentId): self
    {
        $this->requests->asAgentId($agentId);

        return $this;
    }

    /**
     * Runs the command unkeyed as the agent of this id, in a request scope of its own, leaving that agent acting.
     *
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    public function runAsAgentId(string $agentId, Command $command): mixed
    {
        $this->app->forgetScopedInstances();

        return $this->actAsAgentId($agentId)->runUnkeyed($command);
    }

    /**
     * Acts as an agent and session known only by their ids, which need not exist.
     */
    public function actAsAgentIds(string $agentId, string $sessionId): self
    {
        $this->requests->asAgent($agentId, $sessionId);

        return $this;
    }

    public function actAsInboxMemberId(string $userId): self
    {
        $this->requests->asInboxMemberId($userId);

        return $this;
    }

    /**
     * Puts the journal's server clock, the time every command reads, at the moment given; Carbon keeps its own time.
     */
    public function useServerClockAt(CarbonImmutable $now): self
    {
        $this->serverClock = new FakeServerClock($now);
        $this->app->instance(ServerClock::class, $this->serverClock);

        return $this;
    }

    /**
     * Moves the server clock useServerClockAt() put in place; Carbon stays where it is.
     */
    public function moveServerClockTo(CarbonImmutable $later): self
    {
        ($this->serverClock ?? throw FixtureRefused::noServerClock())->set($later);

        return $this;
    }

    /**
     * Moves Carbon's time, what now() gives in the test and the application; the server clock stays where it is.
     */
    public function travelTo(CarbonImmutable $later): self
    {
        Carbon::setTestNow($later);
        CarbonImmutable::setTestNow($later);

        return $this;
    }

    /**
     * A message the user or agent of this name posts to the inbox, under the inbox's next number.
     */
    public function post(string $sender, Inbox $inbox, string $body): Message
    {
        return $this->inboxes->post($inbox, $this->agents[$sender] ?? $this->userCalled($sender), $body);
    }

    public function ownerUser(): User
    {
        return $this->owner ?? throw FixtureRefused::noOwner();
    }

    public function userCalled(string $name): User
    {
        return $this->users[$name] ?? throw FixtureRefused::missingAlias('user', $name, self::OWNER);
    }

    public function agentCalled(string $name): Agent
    {
        return $this->agents[$name] ?? throw FixtureRefused::missingAlias('agent', $name, self::OWNER);
    }

    /**
     * The one session of the agent; an agent started more than once names its start with sessionCalled().
     */
    public function sessionOf(string $agentName): AgentSession
    {
        return $this->startOf($agentName)->session;
    }

    public function startOf(string $agentName): StartedAgent
    {
        $names = $this->startNames[$agentName] ?? throw FixtureRefused::missingAlias('agent', $agentName, self::OWNER);

        if (count($names) !== 1) {
            throw FixtureRefused::notOneStart($agentName, count($names));
        }

        return $this->starts[$names[0]];
    }

    public function sessionCalled(string $start): AgentSession
    {
        return $this->startCalled($start)->session;
    }

    public function startCalled(string $start): StartedAgent
    {
        return $this->starts[$start] ?? throw FixtureRefused::missingAlias('start', $start, self::OWNER);
    }

    /**
     * The named start as a TestStart that signs with the credential the start was issued, making nothing new.
     */
    public function testStartCalled(string $start): TestStart
    {
        $started = $this->startCalled($start);

        return TestStart::of($this->agentCalled($this->startAgents[$start]), $started->session, $started->token);
    }

    public function projectCalled(string $name): Project
    {
        return $this->projects[$name] ?? throw FixtureRefused::missingAlias('project', $name, self::OWNER);
    }

    public function environmentCalled(string $name): Environment
    {
        return $this->environments[$name] ?? throw FixtureRefused::missingAlias('environment', $name, self::OWNER);
    }

    /**
     * The personal inbox of the user or agent of this name.
     */
    public function inboxCalled(string $name): Inbox
    {
        return $this->remembered[$name] ?? Inbox::findPersonalOf($this->actorCalled($name));
    }

    /**
     * Keeps an inbox a command made under a name, for inboxCalled() to give back.
     */
    public function rememberInbox(string $name, Inbox $inbox): self
    {
        if (array_key_exists($name, $this->remembered)) {
            throw FixtureRefused::occupiedAlias($name, 'inbox');
        }

        $this->remembered[$name] = $inbox;

        return $this;
    }

    public function chatOf(string $first, string $second): Inbox
    {
        $key = FixtureInboxes::pairKey($this->actorCalled($first), $this->actorCalled($second));

        return $this->chats[$key] ?? throw FixtureRefused::missingAlias('chat', "{$first} and {$second}", self::OWNER);
    }

    /**
     * The user or agent of this name as the journal names an actor.
     */
    public function actorCalled(string $name): ActorIdentity
    {
        return ActorIdentity::of($this->userOrAgentCalled($name));
    }

    public function userOrAgentCalled(string $name): User|Agent
    {
        return $this->agents[$name] ?? $this->userCalled($name);
    }

    /**
     * Runs the command under a new request key as the user or agent of this name, and puts the selection back after.
     *
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    public function runAs(string $name, Command $command): mixed
    {
        $select = array_key_exists($name, $this->agents)
            ? fn () => $this->requests->asAgent($this->sessionOf($name)->agent_id, $this->sessionOf($name)->id)
            : fn () => $this->requests->asUser($this->userCalled($name));

        return $this->requests->during($select, fn () => $this->run($command));
    }

    private function makeUser(string $name): User
    {
        $name = trim($name);
        $this->refuseTakenName($name);
        $user = User::factory()->create(['name' => $name]);
        $this->users[$name] = $user;
        $this->inboxes->personal(ActorIdentity::of($user));

        return $user;
    }

    private function grantAsOwner(User $user, string|null $environmentId): void
    {
        $owner = $this->ownerUser();
        $this->requests->during(
            fn () => $this->requests->asUser($owner),
            fn () => $this->run(
                new GrantEnvironmentAccessCommand($user->id, $environmentId, [InboxPermission::OpenInboxes]),
            ),
        );
    }

    /**
     * Users and agents share one set of names, so a second actor under a name already given is refused before its row.
     */
    private function refuseTakenName(string $name): void
    {
        if (array_key_exists($name, $this->users)) {
            throw FixtureRefused::occupiedAlias($name, 'user');
        }

        if (array_key_exists($name, $this->agents)) {
            throw FixtureRefused::occupiedAlias($name, 'agent');
        }
    }
}
