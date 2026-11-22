<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Contracts\ReadableModel;
use App\Enums\InterpretationState;
use App\Enums\PositionPurpose;
use App\Values\ReaderCheckpoint;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @phpstan-import-type CheckpointFields from ReaderCheckpoint
 *
 * Where one reader revision stands in one part's output: its checkpoint after the last committed chunk it read, so
 * it resumes there instead of reading from the start.
 *
 * @property string $id
 * @property string $part_run_id
 * @property string $reader_revision_id
 * @property PositionPurpose $purpose
 * @property CheckpointFields $checkpoint
 * @property InterpretationState $interpretation Provisional while reading, ReaderFailed once the reader broke
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['part_run_id', 'reader_revision_id', 'purpose', 'checkpoint', 'interpretation'])]
final class ReaderPosition extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use InsertsAbsentRows;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'purpose' => PositionPurpose::class,
            'checkpoint' => 'array',
            'interpretation' => InterpretationState::class,
        ];
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

    // ----------[ Mutations ]----------

    /**
     * The reader broke on this part (an exception, its time budget or an oversized record); capture goes on and a
     * restart resumes from the last committed offset.
     */
    public function markFailed(): void
    {
        $this->interpretation = InterpretationState::ReaderFailed;
        $this->save();
    }

    /**
     * A replay starts again from the checkpoint the assessment consumed, its interpretation provisional again.
     */
    public function rewindTo(ReaderCheckpoint $consumed): void
    {
        $this->checkpoint = $consumed->toArray();
        $this->interpretation = InterpretationState::Provisional;
        $this->save();
    }

    public function advance(ReaderCheckpoint $checkpoint): void
    {
        $this->checkpoint = $checkpoint->toArray();
        $this->save();
    }

    // ----------[ Answers ]----------

    public function hasFailed(): bool
    {
        return $this->interpretation === InterpretationState::ReaderFailed;
    }

    public function checkpoint(): ReaderCheckpoint
    {
        return ReaderCheckpoint::fromArray($this->checkpoint);
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
        $identity = ['part_run_id' => $part->id, 'reader_revision_id' => $revision->id, 'purpose' => $purpose];

        $position = new self([
            ...$identity,
            'checkpoint' => $checkpoint->toArray(),
            'interpretation' => InterpretationState::Provisional,
        ]);

        $position->setAttribute($position->getKeyName(), $position->newUniqueId());
        $position->insertIfAbsent();

        return self::query()->where($identity)->sole();
    }
}
