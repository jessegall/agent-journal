<?php

declare(strict_types=1);

namespace App\Models\Chats;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\ActorType;
use App\Enums\LineCardPlacement;
use App\Enums\TimelineEventType;
use App\Events\ChatLinePosted;
use App\Support\ActorIdentity;
use App\Support\Cards\DockIdentity;
use App\Values\ChatLine;
use App\Values\PostedLine;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One position in a chat inbox's timeline: a message, a membership change or a plain line a domain posted,
 * numbered under the inbox's lock so the order every reader sees is the order it was accepted in. A message points
 * at its event, never the other way.
 *
 * @property string $id
 * @property string $inbox_id
 * @property int $sequence
 * @property TimelineEventType $type
 * @property string $actor_type
 * @property string $actor_id
 * @property string|null $interval_id
 * @property string|null $line_subject
 * @property string|null $line
 * @property string|null $line_source_type
 * @property string|null $line_source_id
 * @property LineCardPlacement|null $line_card_placement
 * @property CarbonImmutable $created_at
 * @property-read ActorIdentity $actor
 */
#[Table('inbox_timeline_events')]
#[Fillable(['inbox_id', 'sequence', 'type', 'actor_type', 'actor_id', 'interval_id'])]
final class TimelineEvent extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * The most characters a plain line holds.
     */
    public const int LINE_CHARACTER_LIMIT = 240;

    /**
     * The most characters a plain line's subject holds.
     */
    public const int SUBJECT_CHARACTER_LIMIT = 120;

    public const null UPDATED_AT = null;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'type' => TimelineEventType::class,
            'line_card_placement' => LineCardPlacement::class,
            'sequence' => 'integer',
            'created_at' => 'immutable_datetime',
        ];
    }

    /**
     * Writes the event at the sequence the inbox lock handed out; a plain line also holds its words and is raised.
     */
    public static function create(
        string $inboxId,
        int $sequence,
        TimelineEventType $type,
        ActorIdentity $actor,
        string|null $intervalId,
        PostedLine|null $posted = null,
    ): self {
        $event = new self([
            'inbox_id' => $inboxId,
            'sequence' => $sequence,
            'type' => $type,
            ...$actor->asColumns('actor'),
            'interval_id' => $intervalId,
        ]);

        if ($posted !== null) {
            $event->line_subject = mb_substr($posted->subject, 0, self::SUBJECT_CHARACTER_LIMIT);
            $event->line = mb_substr($posted->line, 0, self::LINE_CHARACTER_LIMIT);
            $event->line_source_type = $posted->source?->type;
            $event->line_source_id = $posted->source?->id;
            $event->line_card_placement = $posted->source === null ? null : $posted->placement;
        }

        $event->assertSaved($event->save());

        if ($posted !== null) {
            $event->raise(new ChatLinePosted($event->id, $inboxId, $sequence));
        }

        return $event;
    }

    // ----------[ Accessors ]----------

    /**
     * The plain line this event holds, as a chat shows it.
     *
     * @return Attribute<ChatLine, never>
     */
    protected function chatLine(): Attribute
    {
        return Attribute::get(function () {
            $source = $this->line_source_type === null
                ? null
                : new DockIdentity($this->line_source_type, (string) $this->line_source_id);

            return new ChatLine(
                $this->sequence,
                (string) $this->line_subject,
                (string) $this->line,
                $source,
                $this->line_card_placement ?? LineCardPlacement::Inline,
                $this->created_at,
            );
        })->withoutObjectCaching();
    }

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
