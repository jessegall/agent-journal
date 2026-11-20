<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Ledger\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use Tests\Fixtures\Modules\Ledger\Enums\LedgerAbility;
use Tests\Fixtures\Modules\Ledger\Handlers\OpenLedgerHandler;
use Tests\Fixtures\Modules\Ledger\Models\Ledger;
use Tests\Fixtures\Modules\Ledger\Policies\LedgerPolicy;

/**
 * Opens a ledger and answers its id.
 *
 * @extends Command<string>
 */
#[HandledBy(OpenLedgerHandler::class)]
#[Authorize(LedgerPolicy::class, LedgerAbility::Work)]
#[Operation('open_ledger', ResourceAreaType::JournalWork, AccessType::Create)]
final readonly class OpenLedger extends Command implements AuthorizedCommand
{
    public function __construct(public string $title) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Ledger::class;
    }
}
