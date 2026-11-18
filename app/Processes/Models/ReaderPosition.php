<?php

declare(strict_types=1);

namespace App\Processes\Models;

use App\Links\Support\Linkable;
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
 * @property CheckpointFields $checkpoint
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['part_run_id', 'reader_revision_id', 'checkpoint'])]
final class ReaderPosition extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids, Linkable;

    /**
     * The position of a reader in a part, started empty the first time.
     */
    public static function of(PartRun $part, ReaderRevision $revision): self
    {
        return self::query()->firstOrCreate(
            ['part_run_id' => $part->id, 'reader_revision_id' => $revision->id],
            ['checkpoint' => new ReaderCheckpoint()->toArray()],
        );
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

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['checkpoint' => 'array'];
    }
}
