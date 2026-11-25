<?php

declare(strict_types=1);

namespace Domain\Memory\Models;

use App\Concerns\BoundedReads;
use App\Concerns\HasNumber;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\Numbered;
use App\Contracts\Records\ReadableModel;
use App\Models\Concerns\FindsForUpdate;
use App\Models\Support\BelongsToOneActor;
use App\Support\ActorIdentity;
use Domain\Memory\Events\MemoryRevised;
use Domain\Memory\Events\MemorySaved;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * Something an agent must still know when its context starts again. Its weight, 1 to 10, is the agent's own
 * priority: heavier memories come first when a context budget leaves light ones out. Only the agent that keeps it
 * reads it.
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
#[Fillable([
    'text',
    'weight',
    'revision',
])]
final class Memory extends Model implements EventSource, Numbered, ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use FindsForUpdate;
    use HasNumber;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * The record type a memory is linked and found under.
     */
    public const string LINK_TYPE = 'memory.memory';

    public const int LIGHTEST = 1;

    public const int HEAVIEST = 10;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'weight' => 'integer',
            'revision' => 'integer',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * Keeps a new memory for its owner.
     */
    public static function create(ActorIdentity $owner, string $text, int $weight): self
    {
        $memory = new self();
        $memory->text = $text;
        $memory->weight = $weight;
        $memory->revision = 1;
        $memory->saveFor($owner);

        return $memory;
    }

    // ----------[ Mutations ]----------

    /**
     * Rewrites the text, the weight or both as one change, one revision later; a value left out stays as it is.
     */
    public function revise(string|null $text, int|null $weight): void
    {
        $this->text = $text === null ? $this->text : $text;
        $this->weight = $weight === null ? $this->weight : $weight;
        $this->revision++;
        $this->assertSaved($this->save());
        $this->raise(new MemoryRevised($this->id));
    }

    // ----------[ Predicates ]----------

    public function isAtRevision(int $expectedRevision): bool
    {
        return $this->revision === $expectedRevision;
    }

    // ----------[ Queries ]----------

    public function saveFor(ActorIdentity $actor): void
    {
        $this->belongTo($actor);
        $this->assertSaved($this->save());
        $this->raise(new MemorySaved($this->id));
    }
}
