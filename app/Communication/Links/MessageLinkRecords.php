<?php

declare(strict_types=1);

namespace App\Communication\Links;

use App\Communication\Models\Message;
use App\Reads\Support\ReadBuilder;
use App\Records\Contracts\RecordProvider;
use App\Records\Data\RecordCard;
use App\Records\Support\ProvidesModelRecords;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Database\Eloquent\Model;

/**
 * Messages as linkable records, kept as private as Chat keeps them: an agent reads only the messages addressed to it,
 * a user reads every one, and anyone else is answered as if the message did not exist. A card shows the first line.
 */
#[Scoped]
final readonly class MessageLinkRecords implements RecordProvider
{
    /**
     * @use ProvidesModelRecords<Message>
     */
    use ProvidesModelRecords;

    public function referenceWord(): string
    {
        return 'message';
    }

    protected function linkType(): string
    {
        return Message::LINK_TYPE;
    }

    protected function readableRecords(): ReadBuilder
    {
        return Message::query();
    }

    protected function cardOf(Model $record): RecordCard
    {
        return RecordCard::from([
            'type' => Message::LINK_TYPE,
            'id' => $record->id,
            'number' => (string) $record->number,
            'label' => "message {$record->number}",
            'title' => $record->firstLine(),
            'abstract' => null,
            'route' => null,
        ]);
    }

    /**
     * A message's participants, the agent it is addressed to and the user, read it; reading it is what changing its
     * links needs.
     */
    protected function mayChange(Model $record): bool
    {
        return true;
    }
}
