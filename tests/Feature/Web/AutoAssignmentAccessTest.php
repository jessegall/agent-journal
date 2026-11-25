<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Contracts\Assignments\AutoAssignmentAccess;
use App\Exceptions\AssignmentDenied;
use App\Exceptions\AutoAssignmentDenied;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Providers\AssignmentsServiceProvider;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use App\Support\ClosedAutoAssignmentAccess;
use App\Support\OwnerAutoAssignmentAccess;
use App\Support\StartSessions;
use App\Support\SystemActor;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Who may read and change auto-assignments: nobody without the web policy; with it, the owner anyone's, a dispatcher
 * another agent's but never its own or a user's, and any other agent only reads its own, without totals.
 */
final class AutoAssignmentAccessTest extends TestCase
{
    use RefreshHookDatabase;

    private User $owner;

    private Agent $dispatcher;

    private Agent $worker;

    private AutoAssignmentAccess $access;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->dispatcher = $this->started(Agent::create('Main', 'main-agent', $this->localProject()));
        $this->worker = $this->started(Agent::create('Worker', 'writing-helper', $this->localProject()));
        $this->access = $this->app->make(AutoAssignmentAccess::class);
    }

    public function test_without_the_web_policy_nobody_may_read_or_write(): void
    {
        unset($this->app[AutoAssignmentAccess::class]);
        new AssignmentsServiceProvider($this->app)->register();
        $access = $this->app->make(AutoAssignmentAccess::class);

        $this->assertInstanceOf(ClosedAutoAssignmentAccess::class, $access);
        $this->assertThrows(
            fn () => $access->assertMayRead($this->owner, ActorIdentity::of($this->owner)),
            AutoAssignmentDenied::class,
        );
        $this->assertThrows(
            fn () => $access->assertMayWrite($this->owner, ActorIdentity::of($this->worker)),
            AutoAssignmentDenied::class,
        );
    }

    public function test_the_owner_reads_and_writes_anyone_itself_included(): void
    {
        $this->assertInstanceOf(OwnerAutoAssignmentAccess::class, $this->access);

        foreach ([ActorIdentity::of($this->owner), ActorIdentity::of($this->worker)] as $target) {
            $this->access->assertMayRead($this->owner, $target);
            $this->access->assertMayWrite($this->owner, $target);
            $this->assertTrue($this->access->mayReadTotals($this->owner, $target));
        }
    }

    public function test_a_dispatcher_writes_another_agent_but_not_itself_or_a_user(): void
    {
        $this->access->assertMayWrite($this->dispatcher, ActorIdentity::of($this->worker));
        $this->access->assertMayRead($this->dispatcher, ActorIdentity::of($this->worker));

        $this->assertTrue($this->access->mayReadTotals($this->dispatcher, ActorIdentity::of($this->worker)));
        $this->assertThrows(
            fn () => $this->access->assertMayWrite($this->dispatcher, ActorIdentity::of($this->dispatcher)),
            AutoAssignmentDenied::class,
        );
        $this->assertThrows(
            fn () => $this->access->assertMayWrite($this->dispatcher, ActorIdentity::of($this->owner)),
            AutoAssignmentDenied::class,
        );
    }

    public function test_a_worker_writes_nobody_and_reads_only_its_own_without_totals(): void
    {
        $other = Agent::create('Other', 'writing-helper', $this->localProject());

        $this->access->assertMayRead($this->worker, ActorIdentity::of($this->worker));

        $this->assertFalse($this->access->mayReadTotals($this->worker, ActorIdentity::of($this->worker)));
        $this->assertThrows(
            fn () => $this->access->assertMayWrite($this->worker, ActorIdentity::of($this->worker)),
            AutoAssignmentDenied::class,
        );
        $this->assertThrows(
            fn () => $this->access->assertMayWrite($this->worker, ActorIdentity::of($other)),
            AssignmentDenied::class,
        );
        $this->assertThrows(
            fn () => $this->access->assertMayRead($this->worker, ActorIdentity::of($other)),
            AssignmentDenied::class,
        );
        $this->assertThrows(
            fn () => $this->access->assertMayWrite(new SystemActor(), ActorIdentity::of($this->worker)),
            AutoAssignmentDenied::class,
        );
    }

    /**
     * The agent with a live session, so its own profile answers what it may do.
     */
    private function started(Agent $agent): Agent
    {
        $this->app->make(StartSessions::class)->start(
            $agent,
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        );

        return $agent;
    }
}
