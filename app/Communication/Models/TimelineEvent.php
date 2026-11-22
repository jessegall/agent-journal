<?php

declare(strict_types=1);

namespace App\Communication\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Communication\Enums\TimelineEventType;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One position in a chat inbox's timeline: a message or a membership change, numbered under the inbox's lock so the
 * order every reader sees is the order it was accepted in. A message points at its event, never the other way.
 *
 * @property string $id
 * @property string $inbox_id
 * @property int $sequence
 * @property TimelineEventType $type
 * @property string $actor_type
 * @property string $actor_id
 * @property string|null $interval_id
 * @property CarbonImmutable $created_at
 * @property-read ActorIdentity $actor
 */
#[Table('inbox_timeline_events')]
#[Fillable(['inbox_id', 'sequence', 'type', 'actor_type', 'actor_id', 'interval_id'])]
final class TimelineEvent extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const null UPDATED_AT = null;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'type' => TimelineEventType::class,
            'sequence' => 'integer',
            'created_at' => 'immutable_datetime',
        ];
    }

    /**
     * Writes the event at the sequence the inbox lock handed out.
     */
    public static function create(
        string $inboxId,
        int $sequence,
        TimelineEventType $type,
        ActorIdentity $actor,
        string|null $intervalId,
    ): self {
        $event = new self([
            'inbox_id' => $inboxId,
            'sequence' => $sequence,
            'type' => $type,
            ...$actor->asColumns('actor'),
            'interval_id' => $intervalId,
        ]);

        $event->save();

        return $event;
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<ActorIdentity, never>
     */
    protected function actor(): Attribute
    {
        return Attribute::get(fn () => new ActorIdentity(ActorType::from($this->actor_type), $this->actor_id));
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofInbox(Builder $query, string $inboxId): void
    {
        $query->where('inbox_id', $inboxId);
    }
}
