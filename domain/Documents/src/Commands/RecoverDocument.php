<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use Domain\Documents\Api\CloseResult;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Enums\DocumentAbility;
use Domain\Documents\Handlers\RecoverDocumentHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * A user closes an abandoned draft at the version they were shown, with a reason; a changed text becomes the next
 * revision under the draft's author.
 *
 * @extends Command<CloseResult>
 */
#[HandledBy(RecoverDocumentHandler::class)]
#[Operation('recover_document', ResourceAreaType::JournalContent, AccessType::Edit)]
#[Authorize(DocumentAdministrationPolicy::class, DocumentAbility::Administer)]
final readonly class RecoverDocument extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public DraftTarget $draft,
        #[Required, Max(Document::SETTLEMENT_REASON_CHARACTERS)]
        public string $reason,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Document::class;
    }
}
