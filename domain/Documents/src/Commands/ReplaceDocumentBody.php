<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Handlers\ReplaceDocumentBodyHandler;

/**
 * Replaces the whole body of a draft.
 *
 * @implements Command<DraftReference>
 */
#[HandledBy(ReplaceDocumentBodyHandler::class)]
final readonly class ReplaceDocumentBody implements Command
{
    public function __construct(
        public DraftTarget $draft,
        public string $body,
    ) {}
}
