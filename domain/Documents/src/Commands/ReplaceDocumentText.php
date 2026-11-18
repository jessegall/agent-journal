<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Handlers\ReplaceDocumentTextHandler;

/**
 * Replaces one exact piece of a draft, which must appear exactly once.
 *
 * @implements Command<DraftReference>
 */
#[HandledBy(ReplaceDocumentTextHandler::class)]
final readonly class ReplaceDocumentText implements Command
{
    public function __construct(
        public DraftTarget $draft,
        public string $oldText,
        public string $newText,
    ) {}
}
