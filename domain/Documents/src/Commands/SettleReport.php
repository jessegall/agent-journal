<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use Domain\Documents\Enums\DocumentAbility;
use Domain\Documents\Handlers\SettleReportHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;

/**
 * Settles a report with the reason it needs no more attention.
 *
 * @extends Command<null>
 */
#[HandledBy(SettleReportHandler::class)]
#[Authorize(DocumentAdministrationPolicy::class, DocumentAbility::Work)]
final readonly class SettleReport extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public int $reportNumber,
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
