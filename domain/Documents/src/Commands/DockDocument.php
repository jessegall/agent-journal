<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use Domain\Documents\Enums\DocumentAbility;
use Domain\Documents\Handlers\DockDocumentHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;

/**
 * Docks a document as a card in a running session; docking it again shows the same card.
 *
 * @implements Command<null>
 */
#[HandledBy(DockDocumentHandler::class)]
#[Authorize(DocumentAdministrationPolicy::class, DocumentAbility::Work)]
final readonly class DockDocument implements Command, HasAuthorizationSubject
{
    public function __construct(public int $documentNumber, public string $sessionId) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Document::class;
    }
}
