<?php

declare(strict_types=1);

namespace Domain\Chat\Resolvers\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Records\Contracts\RecordResolver;
use App\Records\Exceptions\RecordUnavailable;
use App\Records\Support\RecordIdentity;
use Domain\Chat\Models\DockedRecord;
use Domain\Chat\Support\ConversationPair;

/**
 * The asker's docked records in one conversation, shown or hidden, newest first; a record the asker can no longer
 * read is left out but its placement stays.
 */
final readonly class DockedRecordRecords
{
    public function __construct(
        private CurrentActor $actors,
        private RecordResolver $records,
    ) {}

    /**
     * @return list<RecordIdentity>
     */
    public function docked(
        ConversationPair $pair,
        bool $hidden = false,
        int $limit = DockedRecord::DEFAULT_LIMIT,
    ): array {
        $placements = DockedRecord::query()
            ->ownedBy(ActorIdentity::of($this->actors->actor()))
            ->inConversation($pair)
            ->shown($hidden)
            ->orderByDesc('docked_at')
            ->orderByDesc('id')
            ->readLimit(max(1, min($limit, DockedRecord::LARGEST_LIMIT)))
            ->get();
        $readable = [];

        foreach ($placements as $placement) {
            try {
                $this->records->requireReadable($placement->record());
                $readable[] = $placement->record();
            } catch (RecordUnavailable) {
                continue;
            }
        }

        return $readable;
    }
}
