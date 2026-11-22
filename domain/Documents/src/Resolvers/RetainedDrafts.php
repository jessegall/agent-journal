<?php

declare(strict_types=1);

namespace Domain\Documents\Resolvers;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Authorization\CurrentAuthorizer;
use App\Contracts\Sessions\SessionProvenance;
use App\Enums\AccessType;
use App\Values\Operation;
use App\Values\ResourceRequest;
use Domain\Documents\Contracts\DraftReader;
use Domain\Documents\Exceptions\DraftMissing;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\RetainedDraft;
use Domain\Documents\Policies\DocumentAdministrationPolicy;
use Domain\Documents\Values\RetainedDraftView;

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
