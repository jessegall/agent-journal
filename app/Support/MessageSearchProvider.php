<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Search\MessageSearch;
use App\Enums\ScoreTier;
use App\Models\Messages\Message;
use App\Values\AdmittedConstraints;
use App\Values\RefreshCandidates;
use App\Values\SearchBatch;
use App\Values\SearchQuery;
use App\Values\SearchResult;
use App\Values\TieredSearchSource;

/**
 * Searches message bodies through the shared bounded tiered search. Every read goes through the Message model,
 * so its visibility scope decides which messages exist for the reader before anything is matched, scored or
 * quoted, and follows that scope as it changes; a hidden message's words give no hit.
 */
final readonly class MessageSearchProvider implements MessageSearch
{
    public function __construct(
        private MessageSearchAccess $access,
        private TieredRecordSearch $tiers,
    ) {}

    public function search(SearchQuery|RefreshCandidates $query): SearchBatch
    {
        $constraints = $this->access->constraints($query->reader);

        if ($constraints->recordIds->hasNoneAllowed()) {
            return SearchBatch::nothing();
        }

        return $this->tiers->search($query, new TieredSearchSource(
            admitted: fn () => self::admitted($constraints),
            idColumn: 'id',
            titleColumn: 'body',
            columns: [
                'id',
                'number',
                'body',
            ],
            titleOf: fn (Message $message): string => $message->body,
            hitOf: self::hitOf(...),
            admitsOpen: fn (string $messageId): bool => $this->access->admitsOpen($query->reader, $messageId),
            referenceOf: fn (): SearchResult|null => null,
        ));
    }

    /**
     * @return ReadBuilder<Message>
     */
    private static function admitted(AdmittedConstraints $constraints): ReadBuilder
    {
        $query = Message::query();

        if ($constraints->recordIds->isRestricted()) {
            $query->whereKey($constraints->recordIds->names());
        }

        return $query;
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
