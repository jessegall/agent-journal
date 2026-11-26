<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Models;

use App\Assignments\Contracts\Assignable;
use App\Concerns\BoundedReads;
use App\Concerns\HasNumber;
use App\Concerns\Linkable;
use App\Models\Agents\Agent;
use App\Models\Support\BelongsToOneActor;
use App\Records\Contracts\Commentable;
use App\Records\Contracts\Numbered;
use App\Records\Contracts\ReadableModel;
use App\Support\ActorReference;
use App\Support\RecordIdentity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A note an agent writes while it works. Only the actor that wrote it reads it; a user reads every note.
 *
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property int $number
 * @property string $text
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['text'])]
#[Table('module_notes')]
final class Note extends Model implements Assignable, Commentable, Numbered, ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasNumber;
    use HasUlids;
    use Linkable;

    public function saveFor(string $agentId): void
    {
        $this->belongTo(ActorReference::ofClass(Agent::class, $agentId));
        $this->save();
    }

    /**
     * Whether the actor wrote this note.
     */
    public function isWrittenBy(ActorReference $actor): bool
    {
        return $this->actor_type === $actor->type && $this->actor_id === $actor->id;
    }

    public function assignmentIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::linkType(), $this->id);
    }
}
