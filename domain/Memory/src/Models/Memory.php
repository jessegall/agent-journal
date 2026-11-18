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
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['text', 'weight'])]
final class Memory extends Model implements Numbered, ReadableModel
{
    use BelongsToOneActor, HasNumber, HasUlids;
    use BoundedReads;
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['weight' => 'integer'];
    }

    public function saveFor(ActorIdentity $actor): void
    {
        $this->belongTo($actor);
        $this->save();
    }
}
