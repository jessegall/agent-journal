<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\CreateDocument;

use App\Attributes\Commands\Authorize;
use App\Attributes\Validation\OneLine;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use App\Support\RecordIdentity;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentPolicy;
use Domain\Documents\Values\CreatedRecord;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Publishes a new document with its text as revision 1.
 * The author is whoever runs the command; the command names no author.
 *
 * @extends Command<CreatedRecord>
 */
#[Authorize(DocumentPolicy::class, AccessType::Create)]
final readonly class CreateDocumentCommand extends Command
{
    public const int MOST_LINKS = 50;

    /**
     * @param  list<RecordIdentity>  $relatedRecords  the records it is about, linked with it or not created at all
     */
    public function __construct(
        #[Required, OneLine, Max(Document::TITLE_CHARACTER_LIMIT)]
        public string $title,
        #[Required, OneLine, Max(Document::ABSTRACT_CHARACTER_LIMIT)]
        public string $abstract,
        public string|null $body,
        #[Max(self::MOST_LINKS)]
        public array $relatedRecords = [],
        public string|null $uploadId = null,
    ) {}
}
