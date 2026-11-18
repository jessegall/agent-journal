<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Documents\Handlers\HideDocumentDockHandler;

/**
 * Hides a document's card in a session; the document and its links stay.
 *
 * @implements Command<null>
 */
#[HandledBy(HideDocumentDockHandler::class)]
final readonly class HideDocumentDock implements Command
{
    public function __construct(public int $documentNumber, public string $sessionId) {}
}
