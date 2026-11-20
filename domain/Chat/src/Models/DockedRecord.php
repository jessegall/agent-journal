<?php

declare(strict_types=1);

namespace Domain\Chat\Models;

use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Domain\Chat\Models\Concerns\PlacedInConversation;
use Domain\Chat\Support\ConversationPair;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * A record its owner keeps above the composer of one conversation: docked, hidden for now, or restored. The
 * placement is the owner's alone; the record itself is untouched.
 *
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $source_inbox_id
 * @property string $destination_inbox_id
 * @property string $record_type
 * @property string $record_id
 * @property CarbonImmutable $docked_at
 * @property CarbonImmutable|null $hidden_at
 */
#[Fillable(['source_inbox_id', 'destination_inbox_id', 'record_type', 'record_id', 'docked_at'])]
final class DockedRecord extends Model implements ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use PlacedInConversation;

    public const int DEFAULT_LIMIT = 50;

    public const int LARGEST_LIMIT = 100;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['docked_at' => 'immutable_datetime', 'hidden_at' => 'immutable_datetime'];
    }

    /**
     * Docks the record in the conversation for the owner; docking it again shows the one placement again.
     */
    public static function create(
        ActorIdentity $owner,
        ConversationPair $conversation,
        RecordIdentity $record,
    ): self {
        $existing = self::placed($owner, $conversation, $record);

        if ($existing !== null) {
            $existing->restore();

            return $existing;
        }

        $placement = new self([
            'source_inbox_id' => $conversation->sourceInboxId,
            'destination_inbox_id' => $conversation->destinationInboxId,
            'record_type' => $record->type,
            'record_id' => $record->id,
            'docked_at' => CarbonImmutable::now(),
        ]);
        $placement->belongTo($owner);
        $placement->save();

        return $placement;
    }

    // ----------[ Queries ]----------

    /**
     * The owner's placement of the record in the conversation, when there is one.
     */
    public static function placed(
        ActorIdentity $owner,
        ConversationPair $conversation,
        RecordIdentity $record,
    ): self|null {
        return self::query()
            ->ownedBy($owner)
            ->inConversation($conversation)
            ->where('record_type', $record->type)
            ->where('record_id', $record->id)
            ->lockForUpdate()
            ->first();
    }

    // ----------[ Mutations ]----------

    public function hide(): void
    {
        if ($this->hidden_at === null) {
            $this->hidden_at = CarbonImmutable::now();
            $this->save();
        }
    }

    public function restore(): void
    {
        if ($this->hidden_at !== null) {
            $this->hidden_at = null;
            $this->save();
        }
    }

    // ----------[ Answers ]----------

    public function record(): RecordIdentity
    {
        return new RecordIdentity($this->record_type, $this->record_id);
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function shown(Builder $query, bool $hidden): void
    {
        if ($hidden) {
            $query->whereNotNull('hidden_at');

            return;
        }

        $query->whereNull('hidden_at');
    }
}
