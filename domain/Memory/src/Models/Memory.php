<?php

declare(strict_types=1);

namespace Domain\Memory\Models;

use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Support\HasNumber;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Domain\Memory\Exceptions\MemoryInvalid;
use Domain\Memory\Exceptions\MemoryRevisionChanged;
use Domain\Memory\Exceptions\MemoryUnavailable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * Something an agent must still know after a compaction. Each compaction lowers its weight by one; at nought it is gone.
 * Only the agent that keeps it reads it.
 *
 * @property string $id
 * @property string $number_group_id
 * @property int $number
 * @property string $actor_type
 * @property string $actor_id
 * @property string $text
 * @property int $weight
 * @property int $revision
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['text', 'weight', 'revision'])]
final class Memory extends Model implements Numbered, ReadableModel
{
    use BelongsToOneActor, HasNumber, HasUlids;
    use BoundedReads;
    use Linkable;

    public const int LIGHTEST = 1;

    public const int HEAVIEST = 10;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['weight' => 'integer', 'revision' => 'integer'];
    }

    /**
     * Keeps a new memory for its owner.
     *
     * @throws MemoryInvalid
     */
    public static function keep(ActorIdentity $owner, string $text, int $weight): self
    {
        $memory = new self();
        $memory->text = self::checkedText($text);
        $memory->weight = self::checkedWeight($weight);
        $memory->revision = 1;
        $memory->saveFor($owner);

        return $memory;
    }

    /**
     * One of the calling actor's own memories, locked for a change; another actor's answers as unavailable.
     *
     * @throws MemoryUnavailable
     */
    public static function ownForUpdate(string $memoryId): self
    {
        return self::query()->whereKey($memoryId)->lockForUpdate()->first() ?? throw MemoryUnavailable::forId($memoryId);
    }

    /**
     * @throws MemoryRevisionChanged
     */
    public function requireRevision(int $expectedRevision): void
    {
        if ($this->revision !== $expectedRevision) {
            throw MemoryRevisionChanged::for($this->id, $expectedRevision, $this->revision);
        }
    }

    public function saveFor(ActorIdentity $actor): void
    {
        $this->belongTo($actor);
        $this->save();
    }

    /**
     * Rewrites the text, the weight or both as one change, one revision later.
     *
     * @throws MemoryInvalid
     */
    public function revise(string|null $text, int|null $weight): void
    {
        if ($text === null && $weight === null) {
            throw MemoryInvalid::nothingToChange();
        }

        $this->text = $text === null ? $this->text : self::checkedText($text);
        $this->weight = $weight === null ? $this->weight : self::checkedWeight($weight);
        $this->revision++;
        $this->save();
    }

    /**
     * @throws MemoryInvalid
     */
    private static function checkedText(string $text): string
    {
        return trim($text) !== '' ? $text : throw MemoryInvalid::blankText();
    }

    /**
     * @throws MemoryInvalid
     */
    private static function checkedWeight(int $weight): int
    {
        return $weight >= self::LIGHTEST && $weight <= self::HEAVIEST ? $weight : throw MemoryInvalid::weight($weight);
    }
}
