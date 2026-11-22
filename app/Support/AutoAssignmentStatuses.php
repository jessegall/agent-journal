<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\AssignedWorkResolver;
use App\Contracts\AssignmentProviders;
use App\Contracts\AutoAssignmentAccess;
use App\Contracts\CurrentActor;
use App\Contracts\DomainAvailability;
use App\Enums\AutoAssignmentState;
use App\Exceptions\AssignmentPoolTooLarge;
use App\Exceptions\AssignmentPoolUnavailable;
use App\Exceptions\AssignmentTypeUnavailable;
use App\Exceptions\AutoAssignmentPoolUnreadable;
use App\Models\AutoAssignment;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

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

    public function of(AutoAssignment $row): AutoAssignmentStatus
    {
        try {
            $fact = $row->toFact();

            $owners = [
                $this->providers->recordOwner($fact->key->assignableType),
                $this->providers->poolOwner($fact->pool->type),
            ];
        } catch (AutoAssignmentPoolUnreadable|AssignmentTypeUnavailable) {
            return AutoAssignmentStatus::unreadable($row->enabled, $row->configuration_revision);
        }

        if (! array_all($owners, fn (string $owner) => $this->domains->isEnabled($owner))) {
            return $this->status($fact, AutoAssignmentState::DomainUnavailable, None::create(), None::create());
        }

        $pool = Some::create($this->describe($fact));

        if (! $fact->enabled) {
            return $this->status($fact, AutoAssignmentState::Off, $pool, None::create());
        }

        return $this->ofActiveFact($fact, $pool);
    }

    /**
     * @param  Option<PoolDescription>  $pool
     */
    private function ofActiveFact(AutoAssignmentFact $fact, Option $pool): AutoAssignmentStatus
    {
        $actor = $fact->key->actor;

        if (! $this->providers->activity($actor->type)->mayTakeWork($actor)) {
            return $this->status($fact, AutoAssignmentState::Inactive, $pool, None::create());
        }

        try {
            $this->providers->poolFactory($fact->pool->type)->open($fact->pool, $actor);
        } catch (AssignmentPoolUnavailable) {
            return $this->status($fact, AutoAssignmentState::PoolUnavailable, $pool, None::create());
        } catch (AssignmentPoolTooLarge) {
            return $this->status($fact, AutoAssignmentState::TooLarge, $pool, None::create());
        }

        $held = $this->work->count($fact->key->assignableType, AssigneeIdentity::ofActorIdentity($actor));
        $room = min($fact->size, max(0, $this->room->available($fact, $held)));

        $totals = $this->access->mayReadTotals($this->actors->actor(), $actor)
            ? Some::create(new AssignmentTotals($held, $room))
            : None::create();

        $state = match (true) {
            $held > $fact->size => AutoAssignmentState::OverCapacity,
            $room === 0 => AutoAssignmentState::Full,
            default => AutoAssignmentState::Ready,
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
        AutoAssignmentState $state,
        Option $pool,
        Option $totals,
    ): AutoAssignmentStatus {
        return new AutoAssignmentStatus(
            $fact->enabled,
            $state,
            $fact->revision,
            $pool,
            Some::create($fact->size),
            $totals,
            Option::fromValue($fact->lastServedAt),
        );
    }
}
