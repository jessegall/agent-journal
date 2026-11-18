<?php

declare(strict_types=1);

namespace App\Processes\Models;

use App\Links\Support\Linkable;
use App\Processes\Enums\InterpretationState;
use App\Processes\Enums\PositionPurpose;
use App\Processes\Values\ReaderCheckpoint;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
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
    use HasUlids, Linkable;

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

    /**
     * The live position of a reader in a part, started empty the first time.
     */
    public static function of(PartRun $part, ReaderRevision $revision): self
    {
        return self::query()->firstOrCreate(
            ['part_run_id' => $part->id, 'reader_revision_id' => $revision->id, 'purpose' => PositionPurpose::Live],
            ['checkpoint' => new ReaderCheckpoint()->toArray(), 'interpretation' => InterpretationState::Provisional],
        );
    }

    /**
     * A replay's own position, apart from the live one: it starts again from the first byte each time.
     */
    public static function replay(PartRun $part, ReaderRevision $revision, ReaderCheckpoint $consumed): self
    {
        return self::query()->updateOrCreate(
            ['part_run_id' => $part->id, 'reader_revision_id' => $revision->id, 'purpose' => PositionPurpose::Replay],
            ['checkpoint' => $consumed->toArray(), 'interpretation' => InterpretationState::Provisional],
        );
    }

    /**
     * The reader broke on this part (an exception, its time budget or an oversized record); capture goes on and a
     * restart resumes from the last committed offset.
     */
    public function markFailed(): void
    {
        $this->interpretation = InterpretationState::ReaderFailed;
        $this->save();
    }

    public function hasFailed(): bool
    {
        return $this->interpretation === InterpretationState::ReaderFailed;
    }

    public function checkpoint(): ReaderCheckpoint
    {
        return ReaderCheckpoint::fromArray($this->checkpoint);
    }

    public function advance(ReaderCheckpoint $checkpoint): void
    {
        $this->checkpoint = $checkpoint->toArray();
        $this->save();
    }
}
