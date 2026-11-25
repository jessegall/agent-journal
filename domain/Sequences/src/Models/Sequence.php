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
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * A stored sequence: its name, a one-line summary and its steps, each with its title, when it runs and when it is
 * done. Its version goes up with each change; a run keeps the steps it started with.
 *
 * @property string $id
 * @property string $name
 * @property string $summary
 * @property list<array{id: string, title: string, runsWhen: string, doneWhen: string}> $steps
 * @property int $version
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'summary', 'steps'])]
final class Sequence extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = ['version' => 1, 'summary' => ''];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'steps' => 'array',
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
     * @return list<array{id: string, title: string, runsWhen: string, doneWhen: string}>
     */
    private static function stored(array $steps): array
    {
        return array_map(fn (SequenceStep $step) => $step->toArray(), $steps);
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<list<SequenceStepData>, never>
     */
    protected function stepList(): Attribute
    {
        return Attribute::get(fn () => array_values(SequenceStepData::collect($this->steps)));
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a sequence that is not there.
     *
     * @phpstan-assert self $row
     *
     * @throws SequenceMissing
     */
    private static function assertFound(self|null $row, string $id): void
    {
        if ($row === null) {
            throw SequenceMissing::forId($id);
        }
    }

    // ----------[ Queries ]----------

    /**
     * @throws SequenceMissing
     */
    public static function byId(string $id): self
    {
        $row = self::query()->whereKey($id)->first();
        self::assertFound($row, $id);

        return $row;
    }

    /**
     * The sequence read under its row lock, for a change that must not cross another.
     *
     * @throws SequenceMissing
     */
    public static function lockedById(string $id): self
    {
        $row = self::query()->whereKey($id)->lockForUpdate()->first();
        self::assertFound($row, $id);

        return $row;
    }

    /**
     * @return HasMany<SequenceRun, $this>
     */
    public function runs(): HasMany
    {
        return $this->hasMany(SequenceRun::class);
    }
}
