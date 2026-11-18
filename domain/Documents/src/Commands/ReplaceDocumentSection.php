<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Handlers\ReplaceDocumentSectionHandler;

/**
 * Replaces one section of a draft; every other section stays byte for byte.
 *
 * @implements Command<DraftReference>
 */
#[HandledBy(ReplaceDocumentSectionHandler::class)]
final readonly class ReplaceDocumentSection implements Command
{
    public function __construct(
        public DraftTarget $draft,
        public string $section,
        public string $body,
    ) {}
}
