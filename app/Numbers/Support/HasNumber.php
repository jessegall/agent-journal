<?php

declare(strict_types=1);

namespace App\Numbers\Support;

use App\Numbers\Exceptions\NumberChanged;
use App\Numbers\Models\GlobalGroup;
use App\Numbers\Models\NumberGroup;
use App\Numbers\Observers\NumberObserver;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    /**
     * @return BelongsTo<NumberGroup, $this>
     */
    public function numberGroup(): BelongsTo
    {
        return $this->belongsTo(NumberGroup::class);
    }

    public function numberHolder(): Model
    {
        return GlobalGroup::journal();
    }

    public function assignNumber(NumberGroup $group, int $number): void
    {
        $this->number_group_id = $group->id;
        $this->number = $number;
    }
}
