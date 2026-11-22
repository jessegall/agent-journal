<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Models;

use App\Enums\ActorType;
use App\Models\Support\BelongsToOneActor;
use App\Support\ActorIdentity;
use App\Contracts\Assignable;
use App\Contracts\Commentable;
use App\Concerns\HasComments;
use App\Support\Cards\DockCard;
use App\Support\Cards\DockIdentity;
use App\Support\Cards\Stack;
use App\Support\Cards\Subtitle;
use App\Support\Cards\Title;
use App\Support\Sources\Contracts\CardContext;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\DockDefinition;
use App\Concerns\Linkable;
use App\Contracts\Numbered;
use App\Concerns\HasNumber;
use App\Contracts\ReadableModel;
use App\Concerns\BoundedReads;
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
final class Note extends Model implements Assignable, Commentable, Dockable, Numbered, ReadableModel
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

    public function identifyFor(DockDefinition $definition): DockIdentity
    {
        return $definition->identity($this->id);
    }

    public function composeDockCard(CardContext $context): DockCard
    {
        return DockCard::named($this->text, Stack::of('root', new Title('title', $this->text), new Subtitle('kind', 'Note')));
    }
}
