<?php

declare(strict_types=1);

namespace App\Support\Links;

use App\Concerns\ProvidesModelRecords;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Records\RecordProvider;
use App\Data\Pages\RecordCard;
use App\Models\Messages\Message;
use App\Support\ActorReference;
use App\Support\ReadBuilder;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Database\Eloquent\Model;

/**
 * Messages as linkable records, kept as private as their inboxes keep them: an agent reads only the messages of its
 * inboxes and is answered about any other as if it did not exist, and a user reads every one. A card shows the first
 * line.
 */
#[Scoped]
final readonly class MessageLinkRecords implements RecordProvider
{
    /**
     * @use ProvidesModelRecords<Message>
     */
    use ProvidesModelRecords;

    public function __construct(private CurrentActor $actors) {}

    public function referenceWord(): string
    {
        return 'message';
    }

    protected function linkType(): string
    {
        return Message::linkType();
    }

    protected function readableRecords(): ReadBuilder
    {
        $reader = $this->actors->actor();

        if (! $reader->isAgent()) {
            return Message::query();
        }

        $actor = ActorReference::fromStored($reader->actorType(), $reader->actorId());

        return Message::query()->inInboxesOf($actor);
    }

    protected function cardOf(Model $record): RecordCard
    {
        return RecordCard::from([
            'type' => Message::linkType(),
            'id' => $record->id,
            'number' => (string) $record->number,
            'label' => "message {$record->number}",
            'title' => strtok($record->body, "\n") ?: $record->body,
            'abstract' => null,
            'route' => null,
        ]);
    }

    /**
     * A message is linked by whoever may read it; reading it is what changing its links needs.
     */
    protected function mayChange(Model $record): bool
    {
        return true;
    }
}
