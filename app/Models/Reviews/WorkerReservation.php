<?php

declare(strict_types=1);

namespace App\Models\Reviews;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Attributes\Scope;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Reviews\WorkerReservationEmptied;
use App\Events\Reviews\WorkerReservationOccupied;
use App\Events\Reviews\WorkerReservationReleased;
use App\Exceptions\WorkerAlreadyAssigned;
use App\Support\AssigneeIdentity;
use App\Support\RecordIdentity;
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
final class WorkerReservation extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    // ----------[ Mutations ]----------

    /**
     * The worker takes the unit as its own; a worker holding another unit is refused.
     *
     * @throws WorkerAlreadyAssigned
     */
    public function occupy(RecordIdentity $root): void
    {
        $this->assertFreeFor($root);

        $this->root_type = $root->type;
        $this->root_id = $root->id;
        $this->assertSaved($this->save());
        $this->raise(new WorkerReservationOccupied($this->id));
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
        $this->assertSaved($this->save());
        $this->raise(new WorkerReservationReleased($this->id));
    }

    /**
     * The worker holds no unit any more, as when it retires.
     */
    public function releaseAll(): void
    {
        $this->root_type = null;
        $this->root_id = null;
        $this->assertSaved($this->save());
        $this->raise(new WorkerReservationEmptied($this->id));
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a reservation that already holds another root.
     *
     * @throws WorkerAlreadyAssigned
     */
    private function assertFreeFor(RecordIdentity $root): void
    {
        if ($this->root_id !== null && ! ($this->root_type === $root->type && $this->root_id === $root->id)) {
            throw WorkerAlreadyAssigned::holding((string) $this->root_type);
        }
    }

    // ----------[ Queries ]----------

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

        foreach ($keys as $holder) {
            $reservation = new self(['holder_type' => $holder->type, 'holder_id' => $holder->id]);
            $reservation->id = $reservation->newUniqueId();
            $reservation->insertIfAbsent();
        }

        $sortedHolders = array_values($keys);
        $rows = self::query()
            ->heldByAnyOf($sortedHolders)
            ->inHolderOrder()
            ->lockForUpdate()
            ->readExactly(count($keys))
            ->get();

        foreach ($rows as $row) {
            $locked["{$row->holder_type}:{$row->holder_id}"] = $row;
        }

        ksort($locked);

        return $locked;
    }

    // ----------[ Scopes ]----------

    /**
     * The reservations of any of the holders.
     *
     * @param  Builder<self>  $query
     * @param  list<AssigneeIdentity>  $holders
     */
    #[Scope]
    protected function heldByAnyOf(Builder $query, array $holders): void
    {
        $query->where(function (Builder $rows) use ($holders): void {
            foreach ($holders as $holder) {
                $rows->orWhere(
                    fn (Builder $row) => $row->where('holder_type', $holder->type)->where('holder_id', $holder->id),
                );
            }
        });
    }

    /**
     * The reservations in the order of their holder.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inHolderOrder(Builder $query): void
    {
        $query->orderBy('holder_type')->orderBy('holder_id');
    }
}
