<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\EditDocument;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Documents\Policies\DocumentPolicy;
use Domain\Documents\Values\DraftReference;
use Domain\Documents\Values\DraftTarget;

/**
 * @extends Command<DraftReference>
 */
#[Authorize(DocumentPolicy::class, AccessType::Edit)]
final readonly class EditDocumentCommand extends Command
{
    public function __construct(
        public DraftTarget $draft,
        public string $section,
        public string|null $body,
        public string|null $uploadId = null,
    ) {}
}
