<?php

declare(strict_types=1);

namespace App\Models\Starts;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Enums\CapacityResource;
use App\Enums\ReservationState;
use App\Exceptions\CapacityUnavailable;
use App\Values\ExecutionBudgets;
use App\Values\HostCapacity;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $start_request_id
 * @property int $cpu_cores
 * @property int $memory_bytes
 * @property int $disk_bytes
 * @property ReservationState $state
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
final class CapacityReservation extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'cpu_cores' => 'integer',
            'memory_bytes' => 'integer',
            'disk_bytes' => 'integer',
            'state' => ReservationState::class,
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * Reserves the start's budgets when the host has room for them beside every reservation still held; a repeat of
     * the same start finds its reservation. Refuses instead of overcommitting. The caller holds the HostCapacityLock.
     *
     * @throws CapacityUnavailable
     */
    public static function create(string $startRequestId, ExecutionBudgets $budgets, HostCapacity $capacity): self
    {
        $existing = self::query()->ofStartRequest($startRequestId)->first();

        if ($existing !== null) {
            return $existing;
        }

        self::assertFits($budgets, $capacity);

        $capacityReservation = new self();
        $capacityReservation->start_request_id = $startRequestId;
        $capacityReservation->cpu_cores = $budgets->cpuCores;
        $capacityReservation->memory_bytes = $budgets->memoryBytes;
        $capacityReservation->disk_bytes = $budgets->workspaceBytes;
        $capacityReservation->state = ReservationState::Reserved;
        $capacityReservation->save();

        return $capacityReservation;
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a start whose budgets do not fit beside every reservation still held.
     *
     * @throws CapacityUnavailable
     */
    private static function assertFits(ExecutionBudgets $budgets, HostCapacity $capacity): void
    {
        $shortage = self::shortageOf($budgets, $capacity);

        if ($shortage === null) {
            return;
        }

        throw CapacityUnavailable::because($shortage, $shortage->shortage());
    }

    // ----------[ Queries ]----------

    /**
     * The resource these budgets would not fit in beside every reservation still held, none when they fit or the
     * host's capacity is not guarded. It reads only and reserves nothing; admission asks it again under its lock.
     */
    public static function shortageOf(ExecutionBudgets $budgets, HostCapacity $capacity): CapacityResource|null
    {
        if (! $capacity->isGuarded) {
            return null;
        }

        $held = self::query()->reserved();

        return match (true) {
            (int) $held->clone()->sum('cpu_cores') + $budgets->cpuCores > $capacity->cpuCores => CapacityResource::Cpu,
            (int) $held->clone()
                ->sum('memory_bytes') + $budgets
                ->memoryBytes > $capacity
                ->memoryBytes => CapacityResource::Memory,
            (int) $held->clone()
                ->sum('disk_bytes') + $budgets
                ->workspaceBytes > $capacity
                ->diskBytes => CapacityResource::Disk,
            default => null,
        };
    }

    public static function isHeldFor(string $startRequestId): bool
    {
        return self::query()
            ->ofStartRequest($startRequestId)
            ->reserved()
            ->exists();
    }

    // ----------[ Scopes ]----------

    /**
     * The start request's reservation.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofStartRequest(Builder $query, string $startRequestId): void
    {
        $query->where('start_request_id', $startRequestId);
    }

    /**
     * The reservations still held.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function reserved(Builder $query): void
    {
        $query->where('state', ReservationState::Reserved);
    }

    /**
     * The rows of the given state.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withState(Builder $query, ReservationState $state): void
    {
        $query->where('state', $state);
    }
}
