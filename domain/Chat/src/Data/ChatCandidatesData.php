<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The users the viewer may add to a group chat: those who may be invited and are not in it yet.
 */
#[TypeScript]
final class ChatCandidatesData extends Data
{
    /**
     * @param  list<ParticipantData>  $candidates
     */
    public function __construct(
        #[DataCollectionOf(ParticipantData::class)]
        public readonly array $candidates,
    ) {}
}
