<?php

declare(strict_types=1);

namespace App\Desks\Providers;

use App\Actors\Contracts\ActorProvisioning;
use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Contracts\ReplyInboxes;
use App\Actors\Enums\ActorType;
use App\Actors\Values\PolicyRegistration;
use App\Agents\Contracts\MainDesk;
use App\Agents\Contracts\MainSeatTakeover;
use App\Assignments\Contracts\AssignmentDestinationResolver;
use App\Assignments\Contracts\AssignmentRegistration;
use App\Assignments\Contracts\SharedHolders;
use App\Assignments\Enums\AssignmentPurpose;
use App\Assignments\Support\AssigneeRegistration;
use App\Communication\Contracts\ActorInboxResolver;
use App\Communication\Contracts\InboxDestinationResolver;
use App\Communication\Contracts\InboxRegistration;
use App\Desks\Console\InstallDesksCommand;
use App\Desks\Contracts\ActorDesks;
use App\Desks\Contracts\RunClaims;
use App\Desks\Models\DeskPreference;
use App\Desks\Models\DeskRecord;
use App\Desks\Models\DeskSeat;
use App\Desks\Policies\DeskPolicy;
use App\Desks\Support\ActorDestinationProvider;
use App\Desks\Support\DeskAssignees;
use App\Desks\Support\DeskDestinationProvider;
use App\Desks\Support\DeskInboxAccess;
use App\Desks\Support\DeskInboxProvider;
use App\Desks\Support\DeskReplyInboxes;
use App\Desks\Support\DeskRunClaims;
use App\Desks\Support\DeskSeatAdmission;
use App\Desks\Support\DeskSeating;
use App\Desks\Support\DeskSeatProvider;
use App\Desks\Support\DestinationRegistry;
use App\Desks\Support\MainDeskNavigation;
use App\Desks\Support\MainTakeover;
use App\Desks\Support\OccupiedForwardingSeats;
use App\Desks\Support\PersonalDeskProvisioning;
use App\Desks\Support\PersonalDesks;
use App\Desks\Support\PreferredDeskInboxes;
use App\Desks\Support\RegisteredAssignmentDestinations;
use App\Desks\Support\RegisteredInboxDestinations;
use App\Desks\Support\SeatedDesks;
use App\Links\Support\LinkTypeRegistry;
use App\Operations\Enums\AccessType;
use Illuminate\Support\ServiceProvider;

/**
 * Core's desks: stable places for work and messages, each an assignee and an inbox, with seats actors take.
 */
final class DesksServiceProvider extends ServiceProvider
{
    private const string OWNER = 'Desks';

    public function register(): void
    {
        $this->app->scoped(DeskSeatAdmission::class);
        $this->app->scoped(DeskSeating::class);
        $this->app->scoped(ActorDesks::class, PersonalDesks::class);
        $this->app->scoped(ActorProvisioning::class, PersonalDeskProvisioning::class);
        $this->app->scoped(RunClaims::class, DeskRunClaims::class);
        $this->app->scoped(MainSeatTakeover::class, MainTakeover::class);
        $this->app->scoped(MainDesk::class, MainDeskNavigation::class);
        $this->app->scoped(ReplyInboxes::class, DeskReplyInboxes::class);
        $this->app->scoped(SharedHolders::class, SeatedDesks::class);
        $this->app->singleton(DestinationRegistry::class);
        $this->app->scoped(AssignmentDestinationResolver::class, RegisteredAssignmentDestinations::class);
        $this->app->scoped(InboxDestinationResolver::class, RegisteredInboxDestinations::class);
        $this->app->scoped(OccupiedForwardingSeats::class);
        $this->app->scoped(ActorInboxResolver::class, PreferredDeskInboxes::class);
    }

    public function boot(
        LinkTypeRegistry $links,
        DestinationRegistry $destinations,
        PolicyCatalogue $policies,
        InboxRegistration $inboxes,
        AssignmentRegistration $assignments,
    ): void {
        $policies->register('Core', new PolicyRegistration(
            DeskPolicy::class,
            [AccessType::Create, AccessType::Edit],
            ownerOnly: [AccessType::Create, AccessType::Edit],
        ));
        $links->register([
            DeskRecord::LINK_TYPE => DeskRecord::class,
            DeskSeat::LINK_TYPE => DeskSeat::class,
            DeskPreference::LINK_TYPE => DeskPreference::class,
        ]);
        $inboxes->register(DeskRecord::INBOX_PROVIDER, DeskInboxProvider::class, DeskInboxAccess::class);
        $assignments->registerOwner(self::OWNER, []);
        $assignments->registerRecord(
            DeskSeat::LINK_TYPE,
            DeskSeatProvider::class,
            self::OWNER,
            AssignmentPurpose::InternalResponsibility,
        );
        $this->commands([InstallDesksCommand::class]);
        $destinations->register(DeskRecord::ASSIGNEE_TYPE, DeskDestinationProvider::class);

        foreach (ActorType::cases() as $actorType) {
            $destinations->register($actorType->value, ActorDestinationProvider::class);
        }

        $assignments->registerAssignees(new AssigneeRegistration(DeskRecord::ASSIGNEE_TYPE, DeskAssignees::class));
    }
}
