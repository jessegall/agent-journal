<?php

declare(strict_types=1);

namespace App\Models\Records;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Engine\NumberGroupRetired;
use App\Events\Engine\NumberTaken;
use App\Exceptions\NumberLimitReached;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $holder_id
 * @property string $holder_type
 * @property string $record_type
 * @property int $last_number
 * @property ?Carbon $retired_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
#[Fillable([
    'holder_type',
    'holder_id',
    'record_type',
])]
final class NumberGroup extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * The highest number a group hands out, the largest signed bigint.
     */
    public const int LAST_NUMBER_LIMIT = PHP_INT_MAX;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = ['last_number' => 0];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'last_number' => 'integer',
            'retired_at' => 'datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * Opens the numbering of one record type for one holder.
     */
    public static function create(string $holderType, string $holderId, string $recordType): void
    {
        self::query()->create([
            'holder_type' => $holderType,
            'holder_id' => $holderId,
            'record_type' => $recordType,
        ]);
    }

    // ----------[ Mutations ]----------

    /**
     * Hands out the next number of the group; the caller holds the group's row lock inside a bus command.
     */
    public function takeNumber(): int
    {
        $this->assertNumberLeft();

        $this->last_number++;
        $this->assertSaved($this->save());
        $this->raise(new NumberTaken($this->id, $this->last_number));

        return $this->last_number;
    }

    /**
     * Marks the group's holder as deleted; the group and its last number stay.
     */
    public function retire(): void
    {
        $this->retired_at = Carbon::now();
        $this->assertSaved($this->save());
        $this->raise(new NumberGroupRetired($this->id));
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a number past the group's limit.
     *
     * @throws NumberLimitReached
     */
    private function assertNumberLeft(): void
    {
        if ($this->last_number >= self::LAST_NUMBER_LIMIT) {
            throw NumberLimitReached::for($this);
        }
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forRecords(Builder $query, string $holderType, string $holderId, string $recordType): void
    {
        $query->where([
            'holder_type' => $holderType,
            'holder_id' => $holderId,
            'record_type' => $recordType,
        ]);
    }

    /**
     * The journal's group for one record type, its holder read by name inside the same statement.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofJournal(Builder $query, string $recordType): void
    {
        $query->where('holder_type', new GlobalGroup()->getMorphClass())
            ->whereIn('holder_id', GlobalGroup::query()->named(GlobalGroup::JOURNAL)->keys())
            ->where('record_type', $recordType);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function locked(Builder $query): void
    {
        $query->lockForUpdate();
    }
}
