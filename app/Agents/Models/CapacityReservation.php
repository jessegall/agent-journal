<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Agents\Enums\ReservationState;
use App\Agents\Exceptions\CapacityUnavailable;
use App\Agents\Support\ExecutionBudgets;
use App\Agents\Support\HostCapacity;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use App\Links\Support\Linkable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One launch's share of the host's CPU, memory and disk, held from admission until its exit is confirmed.
 *
 * @property string $id
 * @property string $launch_request_id
 * @property int $cpu_cores
 * @property int $memory_bytes
 * @property int $disk_bytes
 * @property ReservationState $state
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['launch_request_id', 'cpu_cores', 'memory_bytes', 'disk_bytes', 'state'])]
final class CapacityReservation extends Model implements ReadableModel
{
    use Linkable;

    use BoundedReads;
    use HasUlids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['cpu_cores' => 'integer', 'memory_bytes' => 'integer', 'disk_bytes' => 'integer', 'state' => ReservationState::class];
    }

    /**
     * Reserves the launch's budgets when the host has room for them beside every reservation still held; a repeat of
     * the same launch finds its reservation. Refuses instead of overcommitting. The caller holds the HostCapacityLock.
     *
     * @throws CapacityUnavailable
     */
    public static function reserve(string $launchRequestId, ExecutionBudgets $budgets, HostCapacity $capacity): self
    {
        $existing = self::query()->where('launch_request_id', $launchRequestId)->first();

        if ($existing !== null) {
            return $existing;
        }

        $held = self::query()->where('state', ReservationState::Reserved);

        if ((int) $held->clone()->sum('cpu_cores') + $budgets->cpuCores > $capacity->cpuCores) {
            throw CapacityUnavailable::because("{$budgets->cpuCores} more cores do not fit the host's {$capacity->cpuCores}.");
        }

        if ((int) $held->clone()->sum('memory_bytes') + $budgets->memoryBytes > $capacity->memoryBytes) {
            throw CapacityUnavailable::because('its memory does not fit what the host has left.');
        }

        if ((int) $held->clone()->sum('disk_bytes') + $budgets->workspaceBytes > $capacity->diskBytes) {
            throw CapacityUnavailable::because('its workspace does not fit the disk the host has left.');
        }

        return self::query()->create(['launch_request_id' => $launchRequestId, 'cpu_cores' => $budgets->cpuCores, 'memory_bytes' => $budgets->memoryBytes, 'disk_bytes' => $budgets->workspaceBytes, 'state' => ReservationState::Reserved]);
    }
}
