<?php

declare(strict_types=1);

namespace App\Assignments\Models;

use App\Assignments\Exceptions\WorkerAlreadyAssigned;
use App\Assignments\Support\AssigneeIdentity;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One worker's reservation: the unit of work it holds, if any. Every unit assignment and every retirement takes the
 * reservations of the workers it touches first, locked in their holder order, so two dispatchers giving one idle
 * worker two units commit at most one.
 *
 * @property string $id
 * @property string $holder_type
 * @property string $holder_id
 * @property string|null $root_type
 * @property string|null $root_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['holder_type', 'holder_id', 'root_type', 'root_id'])]
final class WorkerReservation extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;

    // ----------[ Constructors ]----------

    /**
     * The reservations of the workers, made when missing and locked for update in holder order, keyed by holder.
     *
     * @param  list<AssigneeIdentity>  $holders
     * @return array<string, self>
     */
    public static function lockedFor(array $holders): array
    {
        $keys = [];

        foreach ($holders as $holder) {
            $keys["{$holder->type}:{$holder->id}"] = $holder;
        }

        ksort($keys);
        $locked = [];

        foreach ($keys as $key => $holder) {
            self::query()->firstOrCreate(['holder_type' => $holder->type, 'holder_id' => $holder->id]);
            $locked[$key] = self::query()->where('holder_type', $holder->type)->where('holder_id', $holder->id)
                ->lockForUpdate()->sole();
        }

        return $locked;
    }

    // ----------[ Mutations ]----------

    /**
     * The worker takes the unit as its own; a worker holding another unit is refused.
     *
     * @throws WorkerAlreadyAssigned
     */
    public function occupy(RecordIdentity $root): void
    {
        if ($this->root_id !== null && ! ($this->root_type === $root->type && $this->root_id === $root->id)) {
            throw WorkerAlreadyAssigned::holding((string) $this->root_type);
        }

        $this->root_type = $root->type;
        $this->root_id = $root->id;
        $this->save();
    }

    /**
     * The worker no longer holds the unit; a reservation of another unit stays.
     */
    public function release(RecordIdentity $root): void
    {
        if (! ($this->root_type === $root->type && $this->root_id === $root->id)) {
            return;
        }

        $this->root_type = null;
        $this->root_id = null;
        $this->save();
    }

    /**
     * The worker holds no unit any more, as when it retires.
     */
    public function releaseAll(): void
    {
        $this->root_type = null;
        $this->root_id = null;
        $this->save();
    }
}
