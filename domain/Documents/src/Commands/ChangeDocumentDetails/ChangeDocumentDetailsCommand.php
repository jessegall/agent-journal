<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\ChangeDocumentDetails;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\OneLine;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Changes the title and abstract of a draft.
 *
 * @extends Command<DraftReference>
 */
#[Authorize(DocumentPolicy::class, AccessType::Edit)]
final readonly class ChangeDocumentDetailsCommand extends Command
{
    public function __construct(
        public DraftTarget $draft,
        #[Required, OneLine, Max(Document::TITLE_CHARACTER_LIMIT)]
        public string $title,
        #[Required, OneLine, Max(Document::ABSTRACT_CHARACTER_LIMIT)]
        public string $abstract,
    ) {}
}
