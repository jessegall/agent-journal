<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Exceptions\NumberChanged;
use App\Models\Records\GlobalGroup;
use App\Models\Records\NumberGroup;
use App\Observers\NumberObserver;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * The model side of Numbered: numbered within the journal unless the model names another holder, given its number
 * as it is created, and never renumbered after.
 *
 * @property string $number_group_id
 * @property int $number
 */
trait HasNumber
{
    public static function bootHasNumber(): void
    {
        static::creating([
            NumberObserver::class,
            'creating',
        ]);

        static::updating(function (Model $record): void {
            if ($record->isDirty([
                'number',
                'number_group_id',
            ])) {
                throw NumberChanged::for($record);
            }
        });
    }

    public function numberHolder(): Model
    {
        return GlobalGroup::journal();
    }

    /**
     * The id of the record with this number, for a model numbered across the journal; none when no record has it.
     */
    public static function idOfNumber(int $number): string|null
    {
        $id = static::query()->where('number', $number)->value((new static())->getKeyName());

        if (is_string($id)) {
            return $id;
        }

        return null;
    }

    /**
     * The record with this number in the journal's group for its type, found in one statement through the unique
     * (number_group_id, number) index; the group is read inside it, never created.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function numberedInJournal(Builder $query, int $number): void
    {
        $query->where($query->qualifyColumn('number'), $number)->whereIn(
            $query->qualifyColumn('number_group_id'),
            NumberGroup::query()->ofJournal($query->getModel()->getMorphClass())->select('id'),
        );
    }

    public function assignNumber(string $groupId, int $number): void
    {
        $this->number_group_id = $groupId;
        $this->number = $number;
    }
}
