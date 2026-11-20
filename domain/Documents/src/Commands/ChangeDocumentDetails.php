<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\OneLine;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Enums\DocumentAbility;
use Domain\Documents\Handlers\ChangeDocumentDetailsHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Changes the title and abstract of a draft.
 *
 * @extends Command<DraftReference>
 */
#[HandledBy(ChangeDocumentDetailsHandler::class)]
#[Authorize(DocumentAdministrationPolicy::class, DocumentAbility::Work)]
#[Operation('change_document_details', ResourceAreaType::JournalContent, AccessType::Edit)]
final readonly class ChangeDocumentDetails extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public DraftTarget $draft,
        #[Required, OneLine, Max(Document::TITLE_CHARACTERS)]
        public string $title,
        #[Required, OneLine, Max(Document::ABSTRACT_CHARACTERS)]
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
