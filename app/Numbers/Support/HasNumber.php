<?php

declare(strict_types=1);

namespace App\Numbers\Support;

use App\Numbers\Exceptions\NumberChanged;
use App\Numbers\Models\GlobalGroup;
use App\Numbers\Observers\NumberObserver;
use Illuminate\Database\Eloquent\Model;

/**
 * The model side of Numbered: numbered within the journal unless the model names another holder, given its number
 * as it is created, and never renumbered after. Keep number and number_group_id out of the model's Fillable.
 *
 * @property string $number_group_id
 * @property int $number
 */
trait HasNumber
{
    public static function bootHasNumber(): void
    {
        static::creating([NumberObserver::class, 'creating']);
        static::updating(function (Model $record): void {
            if ($record->isDirty(['number', 'number_group_id'])) {
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
        $id = static::query()->where('number', $number)->value((new static)->getKeyName());

        return is_string($id) ? $id : null;
    }

    public function assignNumber(string $numberGroupId, int $number): void
    {
        $this->number_group_id = $numberGroupId;
        $this->number = $number;
    }
}
