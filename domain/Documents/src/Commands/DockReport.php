<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use Domain\Documents\Enums\DocumentAbility;
use Domain\Documents\Handlers\DockReportHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;

/**
 * Docks a report as a card in a running session; docking it again shows the same card.
 *
 * @implements Command<null>
 */
#[HandledBy(DockReportHandler::class)]
#[Authorize(DocumentAdministrationPolicy::class, DocumentAbility::Work)]
final readonly class DockReport implements Command, HasAuthorizationSubject
{
    public function __construct(public int $reportNumber, public string $sessionId) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Document::class;
    }
}
