<?php

declare(strict_types=1);

namespace Domain\Plans\Models;

use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One phase heading of a review edition as it was frozen: its place, the phase, its number, revision and title.
 *
 * @property string $id
 * @property string $edition_id
 * @property int $position
 * @property string $phase_id
 * @property int $phase_number
 * @property int $phase_revision
 * @property string $title
 */
#[Fillable(['edition_id', 'position', 'phase_id', 'phase_number', 'phase_revision', 'title'])]
final class PlanReviewPhase extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;

    public $timestamps = false;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['position' => 'integer', 'phase_number' => 'integer', 'phase_revision' => 'integer'];
    }

    public static function record(PlanReviewEdition $edition, int $position, Phase $phase): self
    {
        return self::query()->create([
            'edition_id' => $edition->id,
            'position' => $position,
            'phase_id' => $phase->id,
            'phase_number' => $phase->number,
            'phase_revision' => $phase->revision,
            'title' => $phase->title,
        ]);
    }

    // ----------[ Queries ]----------

    /**
     * At most limit of the edition's headings after the position, in order.
     *
     * @return Collection<int, self>
     */
    public static function pageOf(string $editionId, int $afterPosition, int $limit): Collection
    {
        return self::query()->where('edition_id', $editionId)->where('position', '>', $afterPosition)
            ->orderBy('position')->orderBy('id')->limit($limit)->get();
    }
}
