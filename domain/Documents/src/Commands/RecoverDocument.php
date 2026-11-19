<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use Domain\Documents\Api\CloseResult;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Enums\DocumentAbility;
use Domain\Documents\Handlers\RecoverDocumentHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;

/**
 * A user closes an abandoned draft at the version they were shown, with a reason; a changed text becomes the next
 * revision under the draft's author.
 *
 * @implements Command<CloseResult>
 */
#[HandledBy(RecoverDocumentHandler::class)]
#[Authorize(DocumentAdministrationPolicy::class, DocumentAbility::Administer)]
final readonly class RecoverDocument implements Command, HasAuthorizationSubject
{
    public function __construct(public DraftTarget $draft, public string $reason) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Document::class;
    }
}
