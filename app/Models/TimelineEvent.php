<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\EventSource;
use App\Contracts\ReadableModel;
use App\Enums\ActorType;
use App\Enums\LineCardPlacement;
use App\Enums\TimelineEventType;
use App\Events\ChatLinePosted;
use App\Support\ActorIdentity;
use App\Support\Cards\DockIdentity;
use App\Values\ChatLine;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One position in a chat inbox's timeline: a message, a membership change or a plain line a domain posted, numbered under the inbox's lock so the
 * order every reader sees is the order it was accepted in. A message points at its event, never the other way.
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

    /**
     * Writes a plain line at the sequence the inbox lock handed out, posted for the actor it tells about, and raises it:
     * what it is about, such as a sequence's name, what it says of it, and the record it shows as a card, if any.
     */
    public static function createLine(
        string $inboxId,
        int $sequence,
        ActorIdentity $actor,
        string $subject,
        string $line,
        DockIdentity|null $source,
        LineCardPlacement $placement,
    ): self {
        $event = new self([
            'inbox_id' => $inboxId,
            'sequence' => $sequence,
            'type' => TimelineEventType::Line,
            ...$actor->asColumns('actor'),
            'interval_id' => null,
        ]);
        $event->line_subject = mb_substr($subject, 0, self::SUBJECT_CHARACTER_LIMIT);
        $event->line = mb_substr($line, 0, self::LINE_CHARACTER_LIMIT);
        $event->line_source_type = $source?->type;
        $event->line_source_id = $source?->id;
        $event->line_card_placement = $source === null ? null : $placement;
        $event->assertSaved($event->save());
        $event->raise(new ChatLinePosted($event->id, $inboxId, $sequence));

        return $event;
    }

    // ----------[ Answers ]----------

    /**
     * The plain line this event holds, as a chat shows it.
     */
    public function chatLine(): ChatLine
    {
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
