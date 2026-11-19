<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Enums\DocumentAbility;
use Domain\Documents\Handlers\ReplaceDocumentSectionHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;

/**
 * Replaces one section of a draft; every other section stays byte for byte.
 *
 * @extends Command<DraftReference>
 */
#[HandledBy(ReplaceDocumentSectionHandler::class)]
#[Authorize(DocumentAdministrationPolicy::class, DocumentAbility::Work)]
final readonly class ReplaceDocumentSection extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public DraftTarget $draft,
        public string $section,
        public string $body,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Document::class;
    }
}
