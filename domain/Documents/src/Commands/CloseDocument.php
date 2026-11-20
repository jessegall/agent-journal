<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Documents\Api\CloseResult;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Handlers\CloseDocumentHandler;
use Domain\Documents\Policies\DocumentPolicy;

/**
 * Closes the editor's draft: a new revision when its text changed, none when it did not. Closing the same draft
 * again returns the first outcome.
 *
 * @extends Command<CloseResult>
 */
#[HandledBy(CloseDocumentHandler::class)]
#[Authorize(DocumentPolicy::class, AccessType::Edit)]
final readonly class CloseDocument extends Command
{
    public function __construct(public DraftTarget $draft) {}
}
