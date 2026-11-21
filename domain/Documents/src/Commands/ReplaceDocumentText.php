<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Policies\DocumentPolicy;

/**
 * Replaces one exact piece of a draft, which must appear exactly once.
 *
 * @extends Command<DraftReference>
 */
#[Authorize(DocumentPolicy::class, AccessType::Edit)]
final readonly class ReplaceDocumentText extends Command
{
    public function __construct(
        public DraftTarget $draft,
        public string $oldText,
        public string $newText,
    ) {}
}
