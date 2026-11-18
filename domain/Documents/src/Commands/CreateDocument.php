<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Documents\Api\CreatedRecord;
use Domain\Documents\Handlers\CreateDocumentHandler;

/**
 * Publishes a new document with its text as revision 1.
 * The author is whoever runs the command; the command names no author.
 *
 * @implements Command<CreatedRecord>
 */
#[HandledBy(CreateDocumentHandler::class)]
final readonly class CreateDocument implements Command
{
    public function __construct(
        public string $title,
        public string $abstract,
        public string $body,
    ) {}
}
