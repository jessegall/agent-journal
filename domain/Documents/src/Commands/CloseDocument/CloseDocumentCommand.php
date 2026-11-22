<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\CloseDocument;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Support\Command;
use Domain\Documents\Policies\DocumentPolicy;
use Domain\Documents\Values\CloseResult;
use Domain\Documents\Values\DraftTarget;

/**
 * Closes the editor's draft: a new revision when its text changed, none when it did not. Closing the same draft
 * again returns the first outcome.
 *
 * @extends Command<CloseResult>
 */
#[Authorize(DocumentPolicy::class, AccessType::Edit)]
final readonly class CloseDocumentCommand extends Command
{
    public function __construct(public DraftTarget $draft) {}
}
