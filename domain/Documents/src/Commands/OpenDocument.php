<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Handlers\OpenDocumentHandler;

/**
 * Opens a draft of a document for whoever runs the command; opening it again in the same session returns the
 * same draft.
 *
 * @implements Command<DraftReference>
 */
#[HandledBy(OpenDocumentHandler::class)]
final readonly class OpenDocument implements Command
{
    public function __construct(public int $documentNumber) {}
}
