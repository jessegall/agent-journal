<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Enums\DocumentAbility;
use Domain\Documents\Handlers\ReplaceDocumentBodyHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;

/**
 * Replaces the whole body of a draft.
 *
 * @extends Command<DraftReference>
 */
#[HandledBy(ReplaceDocumentBodyHandler::class)]
#[Authorize(DocumentAdministrationPolicy::class, DocumentAbility::Work)]
#[Operation('replace_document_body', ResourceAreaType::JournalContent, AccessType::Edit)]
final readonly class ReplaceDocumentBody extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public DraftTarget $draft,
        public string $body,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Document::class;
    }
}
