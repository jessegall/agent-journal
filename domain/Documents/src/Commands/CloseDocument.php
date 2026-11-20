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
use Domain\Documents\Api\CloseResult;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Enums\DocumentAbility;
use Domain\Documents\Handlers\CloseDocumentHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;

/**
 * Closes the editor's draft: a new revision when its text changed, none when it did not. Closing the same draft
 * again returns the first outcome.
 *
 * @extends Command<CloseResult>
 */
#[HandledBy(CloseDocumentHandler::class)]
#[Authorize(DocumentAdministrationPolicy::class, DocumentAbility::Work)]
#[Operation('close_document', ResourceAreaType::JournalContent, AccessType::Edit)]
final readonly class CloseDocument extends Command implements AuthorizedCommand
{
    public function __construct(public DraftTarget $draft) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Document::class;
    }
}
