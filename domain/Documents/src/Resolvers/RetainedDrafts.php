<?php

declare(strict_types=1);

namespace Domain\Documents\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Enums\ActorType;
use App\Agents\Support\SessionProvenance;
use App\Agents\Values\Operation;
use App\Agents\Values\ResourceRequest;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use Domain\Documents\Api\RetainedDraftView;
use Domain\Documents\Contracts\DraftReader;
use Domain\Documents\Exceptions\DraftMissing;
use Domain\Documents\Models\RetainedDraft;

final readonly class RetainedDrafts implements DraftReader
{
    public function __construct(private CurrentActor $actors, private SessionProvenance $provenance) {}

    public function draft(string $id): RetainedDraftView
    {
        return $this->requireReadable($id)->view();
    }

    public function requireReadable(string $id): RetainedDraft
    {
        $actor = $this->actors->actor();
        $draft = RetainedDraft::forRecovery()->find($id) ?? throw DraftMissing::unavailable();

        if ($actor->type === ActorType::User || $this->provenance->isFromCurrentSession($draft)) {
            return $draft;
        }

        $operation = new Operation(
            'journal',
            'docs_drafts_read',
            [AccessType::Read],
            [new ResourceRequest(ResourceAreaType::JournalContent, 'documents.document:'.$draft->document_id)],
            [],
            1,
        );
        if (! $this->provenance->parentHasGrant($draft, $operation)) {
            throw DraftMissing::unavailable();
        }

        return $draft;
    }
}
