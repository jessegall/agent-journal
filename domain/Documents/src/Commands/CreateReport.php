<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Assignments\Support\RecordIdentity;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Documents\Api\CreatedRecord;
use Domain\Documents\Handlers\CreateReportHandler;

/**
 * Files a new report, once; a report is never edited.
 * The author is whoever runs the command; the command names no author.
 *
 * @implements Command<CreatedRecord>
 */
#[HandledBy(CreateReportHandler::class)]
final readonly class CreateReport implements Command
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
}
