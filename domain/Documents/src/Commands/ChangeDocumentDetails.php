<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Handlers\ChangeDocumentDetailsHandler;

/**
 * Changes the title and abstract of a draft.
 *
 * @implements Command<DraftReference>
 */
#[HandledBy(ChangeDocumentDetailsHandler::class)]
final readonly class ChangeDocumentDetails implements Command
{
    public function __construct(
        public DraftTarget $draft,
        public string $title,
        public string $abstract,
    ) {}
}
