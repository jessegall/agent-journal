<?php

declare(strict_types=1);

namespace Domain\Documents\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Agents\Contracts\SessionProvenance;
use App\Agents\Values\Operation;
use App\Agents\Values\ResourceRequest;
use App\Operations\Enums\AccessType;
use Domain\Documents\Api\RetainedDraftView;
use Domain\Documents\Contracts\DraftReader;
use Domain\Documents\Exceptions\DraftMissing;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\RetainedDraft;
use Domain\Documents\Policies\DocumentAdministrationPolicy;

final readonly class RetainedDrafts implements DraftReader
{
    public function __construct(
        private CurrentActor $actors,
        private CurrentAuthorizer $authorizer,
        private SessionProvenance $provenance,
    ) {}

    public function mayAdminister(): bool
    {
        return $this->actors->hasActor() && $this->authorizer->filterActions(
            DocumentAdministrationPolicy::class,
            Document::class,
            [AccessType::Edit],
        ) !== [];
    }

    public function draft(string $id): RetainedDraftView
    {
        return $this->requireReadable($id)->view();
    }

    public function requireReadable(string $id): RetainedDraft
    {
        $this->actors->actor();
        $draft = RetainedDraft::forRecovery()->findOr($id, fn () => throw DraftMissing::unavailable());

        if ($this->mayAdminister() || $this->provenance->isFromCurrentSession($draft)) {
            return $draft;
        }

        $operation = new Operation(
            'journal',
            'docs_drafts_read',
            [AccessType::Read],
            [ResourceRequest::record('documents.document:'.$draft->document_id)],
            [],
            1,
        );

        if (! $this->provenance->parentHasGrant($draft, $operation)) {
            throw DraftMissing::unavailable();
        }

        return $draft;
    }
}
