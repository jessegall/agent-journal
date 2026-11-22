<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\RecoverDocument;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Support\Command;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;
use Domain\Documents\Values\CloseResult;
use Domain\Documents\Values\DraftTarget;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * A user closes an abandoned draft at the version they were shown, with a reason; a changed text becomes the next
 * revision under the draft's author.
 *
 * @extends Command<CloseResult>
 */
#[Authorize(DocumentAdministrationPolicy::class, AccessType::Edit)]
final readonly class RecoverDocumentCommand extends Command
{
    public function __construct(
        public DraftTarget $draft,
        #[Required, Max(Document::SETTLEMENT_REASON_CHARACTER_LIMIT)]
        public string $reason,
    ) {}
}
