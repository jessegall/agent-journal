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
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Enums\DocumentAbility;
use Domain\Documents\Handlers\EditDocumentHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;

/**
 * @extends Command<DraftReference>
 */
#[HandledBy(EditDocumentHandler::class)]
#[Authorize(DocumentAdministrationPolicy::class, DocumentAbility::Work)]
#[Operation('edit_document', ResourceAreaType::JournalDocuments, AccessType::Edit)]
final readonly class EditDocument extends Command implements AuthorizedCommand
{
    public function __construct(
        public DraftTarget $draft,
        public string $section,
        public string|null $body,
        public string|null $uploadId = null,
    ) {}

    public function subject(): string
    {
        return Document::class;
    }
}
