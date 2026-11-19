<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Enums\DocumentAbility;
use Domain\Documents\Handlers\ChangeDocumentDetailsHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;

/**
 * Changes the title and abstract of a draft.
 *
 * @implements Command<DraftReference>
 */
#[HandledBy(ChangeDocumentDetailsHandler::class)]
#[Authorize(DocumentAdministrationPolicy::class, DocumentAbility::Work)]
final readonly class ChangeDocumentDetails implements Command, HasAuthorizationSubject
{
    public function __construct(
        public DraftTarget $draft,
        public string $title,
        public string $abstract,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Document::class;
    }
}
