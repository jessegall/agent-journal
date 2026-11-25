<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\ReplaceDocumentBody;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Documents\Policies\DocumentPolicy;
use Domain\Documents\Values\DraftReference;
use Domain\Documents\Values\DraftTarget;

/**
 * Replaces the whole body of a draft.
 *
 * @extends Command<DraftReference>
 */
#[Authorize(DocumentPolicy::class, AccessType::Edit)]
final readonly class ReplaceDocumentBodyCommand extends Command
{
    public function __construct(
        public DraftTarget $draft,
        public string $body,
    ) {}
}
