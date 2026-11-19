<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
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
final readonly class CloseDocument extends Command implements HasAuthorizationSubject
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
