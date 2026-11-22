<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Agents\Enums\CapacityResource;
use App\Agents\Enums\ReservationState;
use App\Agents\Exceptions\CapacityUnavailable;
use App\Agents\Values\ExecutionBudgets;
use App\Agents\Values\HostCapacity;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One start's share of the host's CPU, memory and disk, held from admission until its exit is confirmed.
 *
 * @property string $id
 * @property string $start_request_id
 * @property int $cpu_cores
 * @property int $memory_bytes
 * @property int $disk_bytes
 * @property ReservationState $state
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['start_request_id', 'cpu_cores', 'memory_bytes', 'disk_bytes', 'state'])]
final class CapacityReservation extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

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

    /**
     * Reserves the start's budgets when the host has room for them beside every reservation still held; a repeat of
     * the same start finds its reservation. Refuses instead of overcommitting. The caller holds the HostCapacityLock.
     *
     * @throws CapacityUnavailable
     */
    public static function reserve(string $startRequestId, ExecutionBudgets $budgets, HostCapacity $capacity): self
    {
        $existing = self::query()->where('start_request_id', $startRequestId)->first();

        if ($existing !== null) {
            return $existing;
        }

        self::assertFits($budgets, $capacity);

        return self::query()->create(
            [
                'start_request_id' => $startRequestId,
                'cpu_cores' => $budgets->cpuCores,
                'memory_bytes' => $budgets->memoryBytes,
                'disk_bytes' => $budgets->workspaceBytes,
                'state' => ReservationState::Reserved,
            ],
        );
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

        $held = self::query()->where('state', ReservationState::Reserved);

        return match (true) {
            (int) $held->clone()->sum('cpu_cores') + $budgets->cpuCores > $capacity->cpuCores => CapacityResource::Cpu,
            (int) $held->clone()->sum('memory_bytes') + $budgets->memoryBytes > $capacity->memoryBytes => CapacityResource::Memory,
            (int) $held->clone()->sum('disk_bytes') + $budgets->workspaceBytes > $capacity->diskBytes => CapacityResource::Disk,
            default => null,
        };
    }

    public static function isHeldFor(string $startRequestId): bool
    {
        return self::query()
            ->where('start_request_id', $startRequestId)
            ->where('state', ReservationState::Reserved)
            ->exists();
    }

    // ----------[ Internals ]----------

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
}
