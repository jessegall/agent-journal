<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\OneLine;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Records\Support\RecordIdentity;
use Domain\Documents\Api\CreatedRecord;
use Domain\Documents\Enums\DocumentAbility;
use Domain\Documents\Handlers\CreateDocumentHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Publishes a new document with its text as revision 1.
 * The author is whoever runs the command; the command names no author.
 *
 * @extends Command<CreatedRecord>
 */
#[HandledBy(CreateDocumentHandler::class)]
#[Authorize(DocumentAdministrationPolicy::class, DocumentAbility::Work)]
final readonly class CreateDocument extends Command implements HasAuthorizationSubject
{
    public const int MOST_LINKS = 50;

    /**
     * @param  list<RecordIdentity>  $about  the records it is about, linked with it or not created at all
     */
    public function __construct(
        #[Required, OneLine, Max(Document::TITLE_CHARACTERS)] public string $title,
        #[Required, OneLine, Max(Document::ABSTRACT_CHARACTERS)] public string $abstract,
        public string $body,
        #[Max(self::MOST_LINKS)] public array $about = [],
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Document::class;
    }
}
