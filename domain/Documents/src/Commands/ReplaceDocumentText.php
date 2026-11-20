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
use Domain\Documents\Handlers\ReplaceDocumentTextHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;

/**
 * Replaces one exact piece of a draft, which must appear exactly once.
 *
 * @extends Command<DraftReference>
 */
#[HandledBy(ReplaceDocumentTextHandler::class)]
#[Authorize(DocumentAdministrationPolicy::class, DocumentAbility::Work)]
#[Operation('replace_document_text', ResourceAreaType::JournalDocuments, AccessType::Edit)]
final readonly class ReplaceDocumentText extends Command implements AuthorizedCommand
{
    public function __construct(
        public DraftTarget $draft,
        public string $oldText,
        public string $newText,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Document::class;
    }
}
