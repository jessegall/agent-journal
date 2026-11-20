<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Handlers\OpenDocumentHandler;
use Domain\Documents\Policies\DocumentPolicy;

/**
 * Opens a draft of a document for whoever runs the command; opening it again in the same session returns the
 * same draft.
 *
 * @extends Command<DraftReference>
 */
#[HandledBy(OpenDocumentHandler::class)]
#[Authorize(DocumentPolicy::class, AccessType::Create)]
final readonly class OpenDocument extends Command
{
    public function __construct(
        public string $documentNumber,
        public int|null $expectedRevision = null,
    ) {}
}
