<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\OneLine;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Records\Support\RecordIdentity;
use Domain\Documents\Api\CreatedRecord;
use Domain\Documents\Enums\DocumentAbility;
use Domain\Documents\Handlers\CreateReportHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Files a new report, once; a report is never edited.
 * The author is whoever runs the command; the command names no author.
 *
 * @extends Command<CreatedRecord>
 */
#[HandledBy(CreateReportHandler::class)]
#[Authorize(DocumentAdministrationPolicy::class, DocumentAbility::Work)]
#[Operation('create_report', ResourceAreaType::JournalContent, AccessType::Create)]
final readonly class CreateReport extends Command implements AuthorizedCommand
{
    public const int MOST_LINKS = 50;

    /**
     * @param  list<RecordIdentity>  $about  the records it is about, linked with it or not created at all
     */
    public function __construct(
        #[Required, OneLine, Max(Document::TITLE_CHARACTERS)]
        public string $title,
        #[Required, OneLine, Max(Document::ABSTRACT_CHARACTERS)]
        public string $abstract,
        public string $body,
        #[Max(self::MOST_LINKS)]
        public array $about = [],
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Document::class;
    }
}
