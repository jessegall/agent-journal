<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use Domain\Documents\Enums\DocumentAbility;
use Domain\Documents\Handlers\SettleDocumentHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Settles a document at the revision the settler read, with the reason it needs no more attention.
 *
 * @extends Command<null>
 */
#[HandledBy(SettleDocumentHandler::class)]
#[Authorize(DocumentAdministrationPolicy::class, DocumentAbility::Work)]
#[Operation('settle_document', ResourceAreaType::JournalDocuments, AccessType::Edit)]
final readonly class SettleDocument extends Command implements AuthorizedCommand
{
    public function __construct(
        public int $documentNumber,
        public int $expectedRevision,
        #[Required, Max(Document::SETTLEMENT_REASON_CHARACTER_LIMIT)]
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
