<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Documents\Api\CloseResult;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Handlers\CloseDocumentHandler;

/**
 * Closes the editor's draft: a new revision when its text changed, none when it did not. Closing the same draft
 * again returns the first outcome.
 *
 * @implements Command<CloseResult>
 */
#[HandledBy(CloseDocumentHandler::class)]
final readonly class CloseDocument implements Command
{
    public function __construct(public DraftTarget $draft) {}
}
