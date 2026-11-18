<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Documents\Handlers\DockDocumentHandler;

/**
 * Docks a document as a card in a running session; docking it again shows the same card.
 *
 * @implements Command<null>
 */
#[HandledBy(DockDocumentHandler::class)]
final readonly class DockDocument implements Command
{
    public function __construct(public int $documentNumber, public string $sessionId) {}
}
