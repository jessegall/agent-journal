<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\SettleDocument;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Settles a document at the revision the settler read, with the reason it needs no more attention.
 *
 * @extends Command<null>
 */
#[Authorize(DocumentPolicy::class, AccessType::Edit)]
final readonly class SettleDocumentCommand extends Command
{
    public function __construct(
        public int $documentNumber,
        public int $expectedRevision,
        #[Required, Max(Document::SETTLEMENT_REASON_CHARACTER_LIMIT)]
        public string $reason,
    ) {}
}
