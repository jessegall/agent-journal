<?php

declare(strict_types=1);

namespace Domain\Plans\Models;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Domain\Tasks\Api\TaskReviewText;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One task of a review edition as it was frozen: its phase's place, its own place, the task, its number and revision,
 * and a copy of its title and brief, kept for the life of the edition whatever the task says later.
 *
 * @property string $id
 * @property string $edition_id
 * @property int $phase_position
 * @property int $position
 * @property string $task_id
 * @property int $task_number
 * @property int $task_revision
 * @property string $title
 * @property string $brief
 */
#[Fillable(['edition_id', 'phase_position', 'position', 'task_id', 'task_number', 'task_revision', 'title', 'brief'])]
final class PlanReviewMember extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public $timestamps = false;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'phase_position' => 'integer',
            'position' => 'integer',
            'task_number' => 'integer',
            'task_revision' => 'integer',
        ];
    }

    public static function record(
        PlanReviewEdition $edition,
        int $phasePosition,
        int $position,
        TaskReviewText $text,
    ): self {
        return self::query()->create([
            'edition_id' => $edition->id,
            'phase_position' => $phasePosition,
            'position' => $position,
            'task_id' => $text->id,
            'task_number' => $text->number,
            'task_revision' => $text->revision,
            'title' => $text->title,
            'brief' => $text->brief,
        ]);
    }

    // ----------[ Queries ]----------

    /**
     * At most limit of one frozen phase's members after the position, in order.
     *
     * @return Collection<int, self>
     */
    public static function pageOf(string $editionId, int $phasePosition, int $afterPosition, int $limit): Collection
    {
        return self::query()->where('edition_id', $editionId)->where('phase_position', $phasePosition)
            ->where('position', '>', $afterPosition)->orderBy('position')->orderBy('id')->limit($limit)->get();
    }

    /**
     * At most limit of the edition's members in its order, across its phases.
     *
     * @return Collection<int, self>
     */
    public static function firstOf(string $editionId, int $limit): Collection
    {
        return self::query()->where('edition_id', $editionId)
            ->orderBy('phase_position')->orderBy('position')->orderBy('id')->limit($limit)->get();
    }

    /**
     * A slice of a frozen brief, by the member, from the offset, at most length characters.
     */
    public static function briefSliceOf(string $memberId, int $offset, int $length): string
    {
        return mb_substr((string) self::query()->whereKey($memberId)->value('brief'), $offset, $length);
    }
}
