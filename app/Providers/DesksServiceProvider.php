<?php

declare(strict_types=1);

namespace App\Providers;

use App\Console\Commands\InstallDesksCommand;
use App\Contracts\Actors\ActorInboxResolver;
use App\Contracts\Actors\ActorProvisioning;
use App\Contracts\Assignments\AssignmentDestinationResolver;
use App\Contracts\Assignments\AssignmentRegistration;
use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Chat\ActorDesks;
use App\Contracts\Chat\InboxDestinationResolver;
use App\Contracts\Chat\InboxRegistration;
use App\Contracts\Chat\MainDesk;
use App\Contracts\Chat\MainSeatTakeover;
use App\Contracts\Chat\ReplyInboxes;
use App\Contracts\Processes\RunClaims;
use App\Contracts\Sharing\SharedHolders;
use App\Enums\AccessType;
use App\Enums\ActorType;
use App\Enums\AssignmentPurpose;
use App\Models\DeskPreference;
use App\Models\DeskRecord;
use App\Models\DeskSeat;
use App\Policies\DeskPolicy;
use App\Support\ActorDestinationProvider;
use App\Support\AssigneeDefinition;
use App\Support\DeskAssignees;
use App\Support\DeskDestinationProvider;
use App\Support\DeskInboxAccess;
use App\Support\DeskInboxProvider;
use App\Support\DeskReplyInboxes;
use App\Support\DeskRunClaims;
use App\Support\DeskSeatAdmission;
use App\Support\DeskSeating;
use App\Support\DeskSeatProvider;
use App\Support\DestinationRegistry;
use App\Support\LinkTypeRegistry;
use App\Support\MainDeskNavigation;
use App\Support\MainTakeover;
use App\Support\OccupiedForwardingSeats;
use App\Support\PersonalDeskProvisioning;
use App\Support\PersonalDesks;
use App\Support\PreferredDeskInboxes;
use App\Support\RegisteredAssignmentDestinations;
use App\Support\RegisteredInboxDestinations;
use App\Support\SeatedDesks;
use App\Values\PolicyDefinition;
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
        $policies->register('Core', new PolicyDefinition(
            DeskPolicy::class,
            [AccessType::Create, AccessType::Edit],
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

        $assignments->registerAssignees(new AssigneeDefinition(DeskRecord::ASSIGNEE_TYPE, DeskAssignees::class));
    }
}
