<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Records\Support\RecordIdentity;
use Domain\Documents\Api\CreatedRecord;
use Domain\Documents\Enums\DocumentAbility;
use Domain\Documents\Handlers\CreateReportHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;

/**
 * Files a new report, once; a report is never edited.
 * The author is whoever runs the command; the command names no author.
 *
 * @extends Command<CreatedRecord>
 */
#[HandledBy(CreateReportHandler::class)]
#[Authorize(DocumentAdministrationPolicy::class, DocumentAbility::Work)]
final readonly class CreateReport extends Command implements HasAuthorizationSubject
{
    public const int MOST_LINKS = 50;

    /**
     * @param  list<RecordIdentity>  $about  the records it is about, linked with it or not created at all
     */
    public function __construct(
        public string $title,
        public string $abstract,
        public string $body,
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
