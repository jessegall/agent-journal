<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Agents\Enums\ReservationState;
use App\Agents\Exceptions\CapacityUnavailable;
use App\Agents\Support\ExecutionBudgets;
use App\Agents\Support\HostCapacity;
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

        $held = self::query()->where('state', ReservationState::Reserved);

        if ((int) $held->clone()->sum('cpu_cores') + $budgets->cpuCores > $capacity->cpuCores) {
            throw CapacityUnavailable::because(
                "{$budgets->cpuCores} more cores do not fit the host's {$capacity->cpuCores}.",
            );
        }

        if ((int) $held->clone()->sum('memory_bytes') + $budgets->memoryBytes > $capacity->memoryBytes) {
            throw CapacityUnavailable::because('its memory does not fit what the host has left.');
        }

        if ((int) $held->clone()->sum('disk_bytes') + $budgets->workspaceBytes > $capacity->diskBytes) {
            throw CapacityUnavailable::because('its workspace does not fit the disk the host has left.');
        }

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

    public static function isHeldFor(string $startRequestId): bool
    {
        return self::query()
            ->where('start_request_id', $startRequestId)
            ->where('state', ReservationState::Reserved)
            ->exists();
    }

    /**
     * Gives the start's share back once its exit is confirmed; releasing it again changes nothing.
     */
    public static function releaseFor(string $startRequestId): void
    {
        self::query()
            ->where('start_request_id', $startRequestId)
            ->where('state', ReservationState::Reserved)
            ->update(['state' => ReservationState::Released]);
    }
}
