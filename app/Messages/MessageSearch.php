<?php

declare(strict_types=1);

namespace App\Messages;

use App\Models\Messages\Message;
use App\Search\Contracts\MessageSearch as MessageSearchContract;
use App\Search\Enums\ScoreTier;
use App\Search\TieredSearch;
use App\Search\Values\AdmittedConstraints;
use App\Search\Values\RefreshCandidates;
use App\Search\Values\SearchBatch;
use App\Search\Values\SearchQuery;
use App\Search\Values\SearchReader;
use App\Search\Values\SearchResult;
use App\Search\Values\TieredSearchSource;
use App\Support\ActorReference;
use App\Support\BoundedReadBuilder;
use App\Support\RecordIdentity;

/**
 * Searches message bodies through the shared bounded tiered search. Every read goes through the Message model,
 * so its visibility scope decides which messages exist for the reader before anything is matched, scored or
 * quoted, and follows that scope as it changes; a hidden message's words give no hit.
 */
final readonly class MessageSearch implements MessageSearchContract
{
    public function __construct(
        private MessageSearchAccess $access,
        private TieredSearch $tiers,
    ) {}

    public function search(SearchQuery|RefreshCandidates $query): SearchBatch
    {
        $constraints = $this->access->constraints($query->reader);

        if ($constraints->recordIds->hasNoneAllowed()) {
            return SearchBatch::nothing();
        }

        return $this->tiers->search($query, new TieredSearchSource(
            admitted: fn () => self::admitted($constraints, $query->reader),
            idColumn: 'id',
            titleColumn: 'body',
            columns: ['id', 'number', 'body'],
            titleOf: fn (Message $message): string => $message->body,
            hitOf: self::hitOf(...),
            admitsOpen: fn (string $messageId) => $this->access->admitsOpen($query->reader, $messageId),
            referenceOf: fn (): SearchResult|null => null,
        ));
    }

    /**
     * @return BoundedReadBuilder<Message>
     */
    private static function admitted(AdmittedConstraints $constraints, SearchReader $reader): BoundedReadBuilder
    {
        $actor = ActorReference::fromStored($reader->actor->actorType(), $reader->actor->actorId());

        return $constraints->narrow(Message::query()->inInboxesOf($actor));
    }

    private static function hitOf(Message $message, ScoreTier $tier): SearchResult
    {
        return SearchResult::shortened(
            "Message {$message->number}",
            $message->body,
            new RecordIdentity(Message::linkType(), $message->id),
            $tier,
        );
    }
}
