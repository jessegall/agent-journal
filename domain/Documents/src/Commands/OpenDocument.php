<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Enums\DocumentAbility;
use Domain\Documents\Handlers\OpenDocumentHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;

/**
 * Opens a draft of a document for whoever runs the command; opening it again in the same session returns the
 * same draft.
 *
 * @extends Command<DraftReference>
 */
#[HandledBy(OpenDocumentHandler::class)]
#[Authorize(DocumentAdministrationPolicy::class, DocumentAbility::Work)]
#[Operation('open_document', ResourceAreaType::JournalContent, AccessType::Create)]
final readonly class OpenDocument extends Command implements AuthorizedCommand
{
    public function __construct(
        public int|string $documentNumber,
        public int|null $expectedRevision = null,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Document::class;
    }
}
