<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Contracts\Actors\ActorAttention;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Assignments\AssignmentStorage;
use App\Contracts\Assignments\AssignmentTransaction;
use App\Enums\Navigation\NavigationAnswerer;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\NavigationRequest;
use App\Models\Inboxes\Inbox;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\AssigneeIdentity;
use App\Support\MainInboxTakeover;
use App\Support\NavigationDispatch;
use App\Support\PendingWorkSources;
use App\Values\OwnerAuthority;
use Closure;
use Tests\Fixtures\Agents\RecordedAttention;
use Tests\Support\Agents\RaisesNavigationRequests;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsInboxes;
use Tests\Support\RunsTrustedCommands;
use Tests\TestCase;

/**
 * A navigation request of a helper's runtime goes to the main inbox and wakes its member once per round; the main
 * agent's own runtime keeps its hold for the user; with nobody attached the request waits at the inbox.
 */
final class NavigationDispatchTest extends TestCase
{
    use CommitsHookRows;
    use InstallsInboxes;
    use RaisesNavigationRequests;
    use RunsTrustedCommands;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'navigation_requests',
        'inboxes', 'inbox_members',
        'assignments',
        'accounts',
        'active_accounts',
        'session_processes',
    ];

    private RecordedAttention $attention;

    protected function setUp(): void
    {
        parent::setUp();
        $this->attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $this->attention);
    }

    public function test_a_helpers_request_goes_to_the_main_inbox_and_wakes_its_member_once_per_round(): void
    {
        $main = $this->seatMain();
        $navigation = $this->raise($this->stalledScript(), 'raise-1');
        $dispatch = $this->app->make(NavigationDispatch::class);

        $answerer = $this->inTransaction(fn () => $dispatch->answererFor($this->runtimeOf($navigation)));
        $this->assertSame(NavigationAnswerer::MainInbox, $answerer);
        $this->inTransaction(fn () => $dispatch->deliver($navigation, 1));
        $this->inTransaction(fn () => $dispatch->deliver($navigation, 1));
        $this->inTransaction(fn () => $dispatch->deliver($navigation, 2));

        $holder = $this->holderOf($navigation);
        $mainInbox = Inbox::findMain();
        $this->assertSame([$mainInbox->assigneeIdentity()->type, $mainInbox->id], [$holder->type, $holder->id]);
        $keys = array_column($this->attention->wakes, 1);
        $this->assertCount(3, $keys);
        $this->assertSame($keys[0], $keys[1]);
        $this->assertNotSame($keys[0], $keys[2]);
        $this->assertTrue($this->attention->wakes[0][0]->isSameAs(ActorIdentity::of($main)));
        $pending = $this->app->make(PendingWorkSources::class);
        $this->assertTrue($this->inTransaction(fn () => $pending->hasWorkFor(ActorIdentity::of($main))));
    }

    public function test_the_main_agents_own_runtime_is_held_for_the_user(): void
    {
        $navigation = $this->raise($this->stalledScript(), 'raise-1');
        $runtime = $this->runtimeOf($navigation);
        $this->seat($runtime->session->agent);

        $dispatch = $this->app->make(NavigationDispatch::class);
        $answerer = $this->inTransaction(fn () => $dispatch->answererFor($runtime));

        $this->assertSame(NavigationAnswerer::User, $answerer);
    }

    public function test_with_nobody_attached_the_request_waits_at_the_inbox_and_wakes_nobody(): void
    {
        $navigation = $this->raise($this->stalledScript(), 'raise-1');

        $dispatch = $this->app->make(NavigationDispatch::class);
        $this->inTransaction(fn () => $dispatch->deliver($navigation, 1));

        $this->assertSame([], $this->attention->wakes);
        $mainInbox = Inbox::findMain();
        $this->assertSame($mainInbox->id, $this->holderOf($navigation)->id);
    }

    private function seatMain(): Agent
    {
        $main = Agent::create('Main', 'main-agent', $this->localProject());
        $this->seat($main);

        return $main;
    }

    private function seat(Agent $agent): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $this->inTransaction(fn () => $this->app->make(MainInboxTakeover::class)->takeOver($agent));
    }

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    private function inTransaction(Closure $work): mixed
    {
        return $this->app->make(AssignmentTransaction::class)->run($work);
    }

    private function runtimeOf(NavigationRequest $navigation): AgentRuntime
    {
        return AgentRuntime::query()->with('session.agent')->findOrFail($navigation->agent_runtime_id);
    }

    private function holderOf(NavigationRequest $navigation): AssigneeIdentity
    {
        $storage = $this->app->make(AssignmentStorage::class);

        return $this->inTransaction(fn () => $storage->lockCurrent($navigation->assignmentIdentity())->get()->holder());
    }
}
