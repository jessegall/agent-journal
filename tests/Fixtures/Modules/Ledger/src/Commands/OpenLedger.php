<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Ledger\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
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
final readonly class OpenLedger extends Command implements HasAuthorizationSubject
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
