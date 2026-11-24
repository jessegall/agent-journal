<?php

declare(strict_types=1);

namespace Tests\Feature\Desks;

use App\Contracts\Assignments\AssignmentDestinationResolver;
use App\Contracts\Assignments\AssignmentTransaction;
use App\Contracts\Chat\ActorDesks;
use App\Contracts\Chat\InboxDestinationResolver;
use App\Contracts\Chat\InboxResolver;
use App\Models\Agents\Agent;
use App\Models\Desks\DeskRecord;
use App\Support\ActorIdentity;
use App\Support\AssigneeIdentity;
use App\Support\DeskSeatService;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsDesks;
use Tests\Support\StartsOwnerRequest;
use Tests\TestCase;

/**
 * Work and messages for a recipient go to the desk of its forwarding seat when it holds one, otherwise to the
 * recipient and its preferred inbox; a desk is its own destination, and a name never decides it.
 */
final class DestinationResolutionTest extends TestCase
{
    use CommitsHookRows;
    use InstallsDesks;
    use StartsOwnerRequest;

    private const array TABLES = [
        'users',
        'agents',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
    ];

    public function test_an_actor_seated_at_main_resolves_to_main_and_main_resolves_to_itself(): void
    {
        $main = DeskRecord::query()->named('main')->sole();
        $agent = Agent::create('Main', 'main-agent');
        $this->provision($agent);
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(DeskSeatService::class)->seat($main->id, ActorIdentity::of($agent)),
        );

        $this->assertSame($main->id, $this->holderId($agent->assigneeIdentity()));
        $this->assertSame($main->inbox_id, $this->inboxId($agent->assigneeIdentity()));
        $this->assertSame($main->id, $this->holderId($main->assigneeIdentity()));
        $this->assertSame($main->inbox_id, $this->inboxId($main->assigneeIdentity()));
    }

    public function test_an_actor_without_a_forwarding_seat_resolves_to_itself_whatever_its_name(): void
    {
        $agent = Agent::create('main', 'read-only-helper');
        $personal = $this->provision($agent);

        $this->assertSame($agent->id, $this->holderId($agent->assigneeIdentity()));
        $this->assertSame($personal, $this->inboxId($agent->assigneeIdentity()));
        $this->assertNotSame(
            $this->app->make(InboxResolver::class)->named('main')->inboxId(),
            $this->inboxId($agent->assigneeIdentity()),
        );
    }

    private function provision(Agent $agent): string
    {
        return $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(ActorDesks::class)->provision(ActorIdentity::of($agent), $agent->name),
        )->inboxId;
    }

    private function holderId(AssigneeIdentity $requested): string
    {
        return $this->app->make(AssignmentDestinationResolver::class)->resolve($requested)->assigneeIdentity()->id;
    }

    private function inboxId(AssigneeIdentity $requested): string
    {
        return $this->app->make(InboxDestinationResolver::class)->resolve($requested)->inboxId();
    }
}
