<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\ReadableModel;
use App\Exceptions\NumberLimitReached;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * The counter that numbers one type of record within one holder: the journal for task 12, a plan for its phase 2. It
 * stays after its holder is deleted, so a number is never handed out twice.
 *
 * @property string $id
 * @property string $holder_type
 * @property string $holder_id
 * @property string $record_type
 * @property int $last_number
 * @property Carbon|null $retired_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['holder_type', 'holder_id', 'record_type'])]
final class NumberGroup extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    /**
     * The highest number a group hands out, the largest signed bigint.
     */
    public const int LAST_NUMBER_LIMIT = PHP_INT_MAX;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = ['last_number' => 0];

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['last_number' => 'integer', 'retired_at' => 'datetime'];
    }

    /**
     * Opens the numbering of one record type for one holder.
     */
    public static function create(string $holderType, string $holderId, string $recordType): void
    {
        self::query()->create(['holder_type' => $holderType, 'holder_id' => $holderId, 'record_type' => $recordType]);
    }

    // ----------[ Mutations ]----------

    /**
     * Hands out the next number of the group; the caller holds the group's row lock inside a bus command.
     */
    public function takeNumber(): int
    {
        if ($this->last_number >= self::LAST_NUMBER_LIMIT) {
            throw NumberLimitReached::for($this);
        }

        $this->last_number++;
        $this->save();

        return $this->last_number;
    }

    /**
     * Marks the group's holder as deleted; the group and its last number stay.
     */
    public function retire(): void
    {
        $this->retired_at = Carbon::now();
        $this->save();
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forRecords(Builder $query, string $holderType, string $holderId, string $recordType): void
    {
        $query->where(['holder_type' => $holderType, 'holder_id' => $holderId, 'record_type' => $recordType]);
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
