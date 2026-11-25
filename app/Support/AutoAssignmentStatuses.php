<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Assignments\AssignedWorkResolver;
use App\Contracts\Assignments\AssignmentProviders;
use App\Contracts\Assignments\AutoAssignmentAccess;
use App\Contracts\Domains\DomainAvailability;
use App\Enums\Assignments\AutoAssignmentStatus;
use App\Exceptions\AssignmentPoolTooLarge;
use App\Exceptions\AssignmentPoolUnavailable;
use App\Exceptions\AssignmentTypeUnavailable;
use App\Models\Records\AutoAssignment;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;
use Spatie\LaravelData\Exceptions\CannotCreateData;

/**
 * Works out where a stored auto-assignment stands now, in order: unreadable, its domain off, off, its actor inactive,
 * its pool giving nothing or too large, then over its size, full or ready. Held count and room are shown only to a
 * reader allowed to see totals; a count that fails is an error, never 0.
 */
final readonly class AutoAssignmentStatuses
{
    public function __construct(
        private CurrentActor $actors,
        private AutoAssignmentAccess $access,
        private AssignmentProviders $providers,
        private DomainAvailability $domains,
        private AssignedWorkResolver $work,
        private AssignmentRoom $room,
    ) {}

    public function of(AutoAssignment $row): AutoAssignmentView
    {
        try {
            $fact = $row->toFact();

            $owners = [
                $this->providers->recordOwner($fact->key->assignableType),
                $this->providers->poolOwner($fact->pool->type),
            ];
        } catch (CannotCreateData|AssignmentTypeUnavailable) {
            return AutoAssignmentView::unreadable($row->enabled, $row->configuration_revision);
        }

        if (! array_all($owners, fn (string $owner) => $this->domains->isEnabled($owner))) {
            return $this->status($fact, AutoAssignmentStatus::DomainUnavailable, None::create(), None::create());
        }

        $pool = Some::create($this->describe($fact));

        if (! $fact->isEnabled) {
            return $this->status($fact, AutoAssignmentStatus::Off, $pool, None::create());
        }

        return $this->ofActiveFact($fact, $pool);
    }

    /**
     * @param  Option<PoolDescription>  $pool
     */
    private function ofActiveFact(AutoAssignmentFact $fact, Option $pool): AutoAssignmentView
    {
        $actor = $fact->key->actor;

        if (! $this->providers->activity($actor->type)->mayTakeWork($actor)) {
            return $this->status($fact, AutoAssignmentStatus::Inactive, $pool, None::create());
        }

        try {
            $this->providers->poolFactory($fact->pool->type)->open($fact->pool, $actor);
        } catch (AssignmentPoolUnavailable) {
            return $this->status($fact, AutoAssignmentStatus::PoolUnavailable, $pool, None::create());
        } catch (AssignmentPoolTooLarge) {
            return $this->status($fact, AutoAssignmentStatus::TooLarge, $pool, None::create());
        }

        $held = $this->work->count($fact->key->assignableType, AssigneeIdentity::ofActorReference($actor));
        $room = min($fact->size, max(0, $this->room->available($fact, $held)));

        $totals = $this->access->mayReadTotals($this->actors->actor(), $actor)
            ? Some::create(new AssignmentTotals($held, $room))
            : None::create();

        $state = match (true) {
            $held > $fact->size => AutoAssignmentStatus::OverCapacity,
            $room === 0 => AutoAssignmentStatus::Full,
            default => AutoAssignmentStatus::Ready,
        };

        return $this->status($fact, $state, $pool, $totals);
    }

    private function describe(AutoAssignmentFact $fact): PoolDescription
    {
        return $this->providers->poolFactory($fact->pool->type)->describe($fact->pool, $fact->key->actor);
    }

    /**
     * @param  Option<PoolDescription>  $pool
     * @param  Option<AssignmentTotals>  $totals
     */
    private function status(
        AutoAssignmentFact $fact,
        AutoAssignmentStatus $state,
        Option $pool,
        Option $totals,
    ): AutoAssignmentView {
        return new AutoAssignmentView(
            $fact->isEnabled,
            $state,
            $fact->revision,
            $pool,
            Some::create($fact->size),
            $totals,
            Option::fromValue($fact->lastServedAt),
        );
    }
}
