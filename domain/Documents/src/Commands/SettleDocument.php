<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Documents\Handlers\SettleDocumentHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Settles a document at the revision the settler read, with the reason it needs no more attention.
 *
 * @extends Command<null>
 */
#[HandledBy(SettleDocumentHandler::class)]
#[Authorize(DocumentPolicy::class, AccessType::Edit)]
final readonly class SettleDocument extends Command
{
    public function __construct(
        public int $documentNumber,
        public int $expectedRevision,
        #[Required, Max(Document::SETTLEMENT_REASON_CHARACTER_LIMIT)]
        public string $reason,
    ) {}
}
