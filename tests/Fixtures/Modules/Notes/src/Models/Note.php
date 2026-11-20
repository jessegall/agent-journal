<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\Assignable;
use App\Comments\Contracts\Commentable;
use App\Comments\Support\HasComments;
use App\Links\Support\Linkable;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Support\HasNumber;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
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
    use HasComments;
    use HasNumber;
    use HasUlids;
    use BoundedReads;
    use Linkable;

    /**
     * The stable name links and assignments use for a note.
     */
    public const string LINK_TYPE = 'notes.note';

    public function saveFor(string $agentId): void
    {
        $this->belongTo(new ActorIdentity(ActorType::Agent, $agentId));
        $this->save();
    }

    /**
     * Whether the actor wrote this note.
     */
    public function isWrittenBy(ActorIdentity $actor): bool
    {
        return $this->actor_type === $actor->type->value && $this->actor_id === $actor->id;
    }

    public function assignmentIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::LINK_TYPE, $this->id);
    }
}
