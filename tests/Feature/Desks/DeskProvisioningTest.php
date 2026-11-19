<?php

declare(strict_types=1);

namespace Tests\Feature\Desks;

use App\Actors\Support\ActorIdentity;
use App\Agents\Commands\CreateAgent;
use App\Agents\Commands\RetireAgent;
use App\Agents\Models\Agent;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use App\Communication\Contracts\Inbox;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Models\InboxRecord;
use App\Desks\Commands\RestoreActorDesk;
use App\Desks\Contracts\ActorDesks;
use App\Desks\Models\DeskRecord;
use App\Desks\Models\DeskSeat;
use App\Desks\Support\DeskSeating;
use App\Desks\Support\SeatChange;
use App\Desks\Support\SeatChangeResult;
use Closure;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsDeskInstall;
use Tests\Support\StartsOwnerRequest;
use Tests\TestCase;

/**
 * Core's desks for its principals and actors: installing creates main and the source desks once; every admitted actor
 * gets a personal desk; losing its only seat gives it a new one, retirement gives none, and restoring an actor whose
 * old seat was taken gives it a new desk.
 */
final class DeskProvisioningTest extends TestCase
{
    use CommitsHookRows;
    use StartsOwnerRequest;
    use RunsDeskInstall;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'launch_credentials',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'command_receipts',
    ];

    public function test_installing_twice_creates_main_and_the_source_desks_once(): void
    {
        $this->installDesks();
        $this->installDesks();

        $main = $this->deskOf($this->app->make(InboxResolver::class)->named('main'));
        $inboxes = $this->app->make(InboxResolver::class);

        $this->assertSame(3, DeskRecord::query()->count());
        $this->assertSame(3, InboxRecord::query()->count());
        $this->assertTrue($main->forwards_occupants);
        $this->assertSame(1, DeskSeat::query()->ofDesk($main)->vacant()->count());
        $this->assertSame(0, $this->deskOf($inboxes->named('system'))->seat_count);
        $this->assertSame(0, $this->deskOf($inboxes->named('engine'))->seat_count);
        $this->assertNotSame(
            $inboxes->named('system')->inboxId(),
            $inboxes->named('engine')->inboxId(),
        );
    }

    public function test_a_created_agent_has_one_personal_desk_it_prefers(): void
    {
        $agentId = $this->app->make(CommandBus::class)->run(new CreateAgent('Builder', 'read-only-helper'));
        $agent = ActorIdentity::of(Agent::query()->findOrFail($agentId));

        $this->assertSame(1, DeskRecord::query()->occupiedBy($agent)->count());
        $this->assertTrue(DeskRecord::preferredBy($agent)->isDefined());
    }

    public function test_losing_the_only_seat_gives_a_new_desk_and_retiring_gives_none(): void
    {
        $builder = ActorIdentity::of(Agent::named('Builder', 'read-only-helper'));
        $reviewer = ActorIdentity::of(Agent::named('Reviewer', 'read-only-helper'));
        $first = $this->provision($builder);
        $this->provision($reviewer);

        $this->inTransaction(fn () => $this->app->make(DeskSeating::class)->replace(
            new SeatChange($first->deskId, $first->seatId, $first->reference, $reviewer),
        ));

        $this->assertSame(1, DeskRecord::query()->occupiedBy($builder)->count());
        $this->assertFalse(DeskRecord::query()->occupiedBy($builder)->whereKey($first->deskId)->exists());
        $desks = DeskRecord::query()->count();

        $this->app->make(CommandBus::class)->run(new RetireAgent($reviewer->id));

        $this->assertSame(0, DeskRecord::query()->occupiedBy($reviewer)->count());
        $this->assertSame($desks, DeskRecord::query()->count());
    }

    public function test_restoring_an_actor_whose_old_seat_was_taken_gives_it_a_new_desk(): void
    {
        $builder = ActorIdentity::of(Agent::named('Builder', 'read-only-helper'));
        $reviewer = ActorIdentity::of(Agent::named('Reviewer', 'read-only-helper'));
        $old = $this->provision($builder);
        $this->app->make(CommandBus::class)->run(new RetireAgent($builder->id));
        $this->inTransaction(fn () => $this->app->make(DeskSeating::class)->seat($old->deskId, $reviewer));
        $this->app->make(RequestKey::class)->set('restore-the-builder');

        $restored = $this->app->make(CommandBus::class)->run(new RestoreActorDesk($builder));

        $this->assertNotSame($old->deskId, $restored->deskId);
        $this->assertTrue(DeskRecord::query()->occupiedBy($reviewer)->whereKey($old->deskId)->exists());
    }

    private function provision(ActorIdentity $actor): SeatChangeResult
    {
        return $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(ActorDesks::class)->provision($actor, 'Personal inbox'),
        );
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

    private function deskOf(Inbox $inbox): DeskRecord
    {
        return DeskRecord::query()->where('inbox_id', $inbox->inboxId())->sole();
    }
}
