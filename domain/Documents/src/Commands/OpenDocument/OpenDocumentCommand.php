<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\OpenDocument;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Documents\Policies\DocumentPolicy;
use Domain\Documents\Values\DraftReference;

/**
 * Opens a draft of a document for whoever runs the command; opening it again in the same session returns the
 * same draft.
 *
 * @extends Command<DraftReference>
 */
#[Authorize(DocumentPolicy::class, AccessType::Create)]
final readonly class OpenDocumentCommand extends Command
{
    public function __construct(
        public string $documentNumber,
        public int|null $expectedRevision = null,
    ) {}
}
