<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Enums\DocumentAbility;
use Domain\Documents\Handlers\OpenDocumentHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;

/**
 * Opens a draft of a document for whoever runs the command; opening it again in the same session returns the
 * same draft.
 *
 * @implements Command<DraftReference>
 */
#[HandledBy(OpenDocumentHandler::class)]
#[Authorize(DocumentAdministrationPolicy::class, DocumentAbility::Work)]
final readonly class OpenDocument implements Command, HasAuthorizationSubject
{
    public function __construct(public int $documentNumber) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Document::class;
    }
}
