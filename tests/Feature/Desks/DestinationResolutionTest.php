<?php

declare(strict_types=1);

namespace Tests\Feature\Desks;

use App\Actors\Support\ActorIdentity;
use App\Agents\Enums\AgentRole;
use App\Agents\Models\Agent;
use App\Assignments\Contracts\AssignmentDestinationResolver;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Support\AssigneeIdentity;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Communication\Contracts\InboxDestinationResolver;
use App\Communication\Contracts\InboxResolver;
use App\Desks\Commands\InstallDesks;
use App\Desks\Contracts\ActorDesks;
use App\Desks\Contracts\SeatingWriter;
use App\Desks\Models\DeskRecord;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * Work and messages for a recipient go to the desk of its forwarding seat when it holds one, otherwise to the
 * recipient and its preferred inbox; a desk is its own destination, and a name never decides it.
 */
final class DestinationResolutionTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = [
        'users',
        'agents',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->startUserRequestAs($owner->id);
        $this->app->make(EntryDispatchers::class)
            ->runAsJournal(CommandEntry::HostControl, 'desk install', new InstallDesks());
    }

    public function test_an_actor_seated_at_main_resolves_to_main_and_main_resolves_to_itself(): void
    {
        $main = DeskRecord::query()->named('main')->sole();
        $agent = Agent::named('Main', AgentRole::MainAgent);
        $this->provision($agent);
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(SeatingWriter::class)->seat($main->id, ActorIdentity::of($agent)),
        );

        $this->assertSame($main->id, $this->holderId($agent->assigneeIdentity()));
        $this->assertSame($main->inbox_id, $this->inboxId($agent->assigneeIdentity()));
        $this->assertSame($main->id, $this->holderId($main->assigneeIdentity()));
        $this->assertSame($main->inbox_id, $this->inboxId($main->assigneeIdentity()));
    }

    public function test_an_actor_without_a_forwarding_seat_resolves_to_itself_whatever_its_name(): void
    {
        $agent = Agent::named('main', AgentRole::ReadOnlyHelper);
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
