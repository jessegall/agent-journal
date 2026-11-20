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
use Domain\Documents\Handlers\CloseReportHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Settles a report with the reason it needs no more attention.
 *
 * @extends Command<null>
 */
#[HandledBy(CloseReportHandler::class)]
#[Authorize(DocumentAdministrationPolicy::class, DocumentAbility::Work)]
#[Operation('close_report', ResourceAreaType::JournalContent, AccessType::Edit)]
final readonly class CloseReport extends Command implements AuthorizedCommand
{
    public function __construct(
        public int|string $reportReference,
        #[Required, Max(Document::SETTLEMENT_REASON_CHARACTERS)]
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
