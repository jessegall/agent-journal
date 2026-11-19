<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Documents\Api\CloseResult;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Handlers\RecoverDocumentHandler;

/**
 * A user closes an abandoned draft at the version they were shown, with a reason; a changed text becomes the next
 * revision under the draft's author.
 *
 * @implements Command<CloseResult>
 */
#[HandledBy(RecoverDocumentHandler::class)]
final readonly class RecoverDocument implements Command
{
    public function __construct(public DraftTarget $draft, public string $reason) {}
}
