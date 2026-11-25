<?php

declare(strict_types=1);

namespace Domain\Sequences\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use Domain\Sequences\Data\SequenceStepData;
use Domain\Sequences\Events\SequenceChanged;
use Domain\Sequences\Events\SequenceDefined;
use Domain\Sequences\Exceptions\SequenceMissing;
use Domain\Sequences\Values\SequenceStep;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Spatie\LaravelData\DataCollection;

/**
 * @property string $id
 * @property string $name
 * @property string $summary
 * @property SequenceStepData[]|DataCollection<array-key, SequenceStepData> $steps
 * @property int $version
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property Collection<int, SequenceRun>|SequenceRun[] $runs
 */
#[Fillable([
    'name',
    'summary',
    'steps',
])]
final class Sequence extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'version' => 1,
        'summary' => '',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'steps' => DataCollection::class.':'.SequenceStepData::class,
            'version' => 'integer',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A new sequence of these steps.
     *
     * @param  list<SequenceStep>  $steps
     */
    public static function create(string $name, string $summary, array $steps): self
    {
        $sequence = new self();
        $sequence->name = $name;
        $sequence->summary = $summary;
        $sequence->steps = self::stored($steps);
        $sequence->assertSaved($sequence->save());
        $sequence->raise(new SequenceDefined($sequence->id));

        return $sequence;
    }

    // ----------[ Mutations ]----------

    /**
     * Replaces the name, summary and steps, one version on; the runs already started keep their own steps.
     *
     * @param  list<SequenceStep>  $steps
     */
    public function change(string $name, string $summary, array $steps): void
    {
        $this->name = $name;
        $this->summary = $summary;
        $this->steps = self::stored($steps);
        $this->version++;
        $this->assertSaved($this->save());
        $this->raise(new SequenceChanged($this->id));
    }

    /**
     * @param  list<SequenceStep>  $steps
     * @return DataCollection<int, SequenceStepData>
     */
    private static function stored(array $steps): DataCollection
    {
        $stored = array_map(fn (SequenceStep $step) => SequenceStepData::from([
            'id' => $step->id,
            'title' => $step->title,
            'runsWhen' => $step->runsWhen,
            'doneWhen' => $step->doneWhen,
        ]), $steps);

        return SequenceStepData::collect($stored, DataCollection::class);
    }

    // ----------[ Transformers ]----------

    /**
     * @return list<SequenceStepData>
     */
    public function stepList(): array
    {
        return array_values($this->steps->items());
    }

    // ----------[ Queries ]----------

    /**
     * @throws SequenceMissing
     */
    public static function byId(string $id): self
    {
        return self::query()->whereKey($id)->firstOr(SequenceMissing::throwing()->forId($id));
    }

    /**
     * The sequence read under its row lock, for a change that must not cross another.
     *
     * @throws SequenceMissing
     */
    public static function lockedById(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->firstOr(SequenceMissing::throwing()->forId($id));
    }

    /**
     * @return HasMany<SequenceRun, $this>
     */
    public function runs(): HasMany
    {
        return $this->hasMany(SequenceRun::class);
    }

    /**
     * The rows of the given name.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withName(Builder $query, string $name): void
    {
        $query->where('name', $name);
    }
}
