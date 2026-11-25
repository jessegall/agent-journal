<?php

declare(strict_types=1);

namespace App\Models\Runs;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\Runs\InterpretationState;
use App\Enums\Runs\PositionPurpose;
use App\Events\Processes\ReaderPositionAdvanced;
use App\Events\Processes\ReaderPositionFailed;
use App\Events\Processes\ReaderPositionRewound;
use App\Values\ReaderCheckpoint;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $part_run_id
 * @property string $reader_revision_id
 * @property PositionPurpose $purpose
 * @property ReaderCheckpoint $checkpoint
 * @property InterpretationState $interpretation
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
final class ReaderPosition extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'purpose' => PositionPurpose::class,
            'checkpoint' => ReaderCheckpoint::class,
            'interpretation' => InterpretationState::class,
        ];
    }

    // ----------[ Mutations ]----------

    /**
     * The reader broke on this part (an exception, its time budget or an oversized record); capture goes on and a
     * restart resumes from the last committed offset.
     */
    public function markFailed(): void
    {
        $this->interpretation = InterpretationState::ReaderFailed;
        $this->assertSaved($this->save());
        $this->raise(new ReaderPositionFailed($this->id));
    }

    /**
     * A replay starts again from the checkpoint the assessment consumed, its interpretation provisional again.
     */
    public function rewindTo(ReaderCheckpoint $consumed): void
    {
        $this->checkpoint = $consumed;
        $this->interpretation = InterpretationState::Provisional;
        $this->assertSaved($this->save());
        $this->raise(new ReaderPositionRewound($this->id));
    }

    public function advance(ReaderCheckpoint $checkpoint): void
    {
        $this->checkpoint = $checkpoint;
        $this->assertSaved($this->save());
        $this->raise(new ReaderPositionAdvanced($this->id));
    }

    // ----------[ Predicates ]----------

    public function hasFailed(): bool
    {
        return $this->interpretation === InterpretationState::ReaderFailed;
    }

    // ----------[ Internals ]----------

    /**
     * The part's position of the purpose for the reader revision, made at the checkpoint when it is new.
     */
    private static function madeFor(
        PartRun $part,
        ReaderRevision $revision,
        PositionPurpose $purpose,
        ReaderCheckpoint $checkpoint,
    ): self {
        $position = new self();
        $position->part_run_id = $part->id;
        $position->reader_revision_id = $revision->id;
        $position->purpose = $purpose;
        $position->checkpoint = $checkpoint;
        $position->interpretation = InterpretationState::Provisional;

        $position->setAttribute($position->getKeyName(), $position->newUniqueId());
        $position->insertIfAbsent();

        return self::query()->forPurpose($part, $revision, $purpose)->sole();
    }

    // ----------[ Queries ]----------

    /**
     * The live position of a reader in a part, started empty the first time.
     */
    public static function of(PartRun $part, ReaderRevision $revision): self
    {
        return self::madeFor($part, $revision, PositionPurpose::Live, new ReaderCheckpoint());
    }

    /**
     * A replay's own position, apart from the live one: it starts again from the first byte each time.
     */
    public static function replayOf(PartRun $part, ReaderRevision $revision, ReaderCheckpoint $consumed): self
    {
        return self::madeFor($part, $revision, PositionPurpose::Replay, $consumed);
    }

    // ----------[ Scopes ]----------

    /**
     * The reader revision's position on the part for that purpose.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forPurpose(Builder $query, PartRun $part, ReaderRevision $revision, PositionPurpose $purpose): void
    {
        $query->where('part_run_id', $part->id)
            ->where('reader_revision_id', $revision->id)
            ->where('purpose', $purpose);
    }

    /**
     * The rows of the given purpose.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withPurpose(Builder $query, PositionPurpose $purpose): void
    {
        $query->where('purpose', $purpose);
    }

    /**
     * The rows of the given part run.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofPartRun(Builder $query, string $partRunId): void
    {
        $query->where('part_run_id', $partRunId);
    }

    /**
     * The rows by updated at descending.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function newestUpdatedFirst(Builder $query): void
    {
        $query->orderByDesc('updated_at');
    }
}
