<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\ReplaceDocumentText;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Documents\Policies\DocumentPolicy;
use Domain\Documents\Values\DraftReference;
use Domain\Documents\Values\DraftTarget;

/**
 * Replaces one exact piece of a draft, which must appear exactly once.
 *
 * @extends Command<DraftReference>
 */
#[Authorize(DocumentPolicy::class, AccessType::Edit)]
final readonly class ReplaceDocumentTextCommand extends Command
{
    public function __construct(
        public DraftTarget $draft,
        public string $oldText,
        public string $newText,
    ) {}
}
