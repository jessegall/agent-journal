<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Documents\Handlers\SettleDocumentHandler;

/**
 * Settles a document at the revision the settler read, with the reason it needs no more attention.
 *
 * @implements Command<null>
 */
#[HandledBy(SettleDocumentHandler::class)]
final readonly class SettleDocument implements Command
{
    public function __construct(
        public int $documentNumber,
        public int $expectedRevision,
        public string $reason,
    ) {}
}
