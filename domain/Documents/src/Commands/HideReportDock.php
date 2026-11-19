<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use Domain\Documents\Enums\DocumentAbility;
use Domain\Documents\Handlers\HideReportDockHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;

/**
 * Hides a report's card in a session; the report and its links stay.
 *
 * @implements Command<null>
 */
#[HandledBy(HideReportDockHandler::class)]
#[Authorize(DocumentAdministrationPolicy::class, DocumentAbility::Work)]
final readonly class HideReportDock implements Command, HasAuthorizationSubject
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
