<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Ledger\Commands;

use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use Tests\Fixtures\Modules\Ledger\Handlers\OpenLedgerHandler;
use Tests\Fixtures\Modules\Ledger\Models\Ledger;
use Tests\Fixtures\Modules\Ledger\Policies\LedgerPolicy;

/**
 * Opens a ledger and answers its id.
 *
 * @extends Command<string>
 */
#[HandledBy(OpenLedgerHandler::class)]
#[Authorize(LedgerPolicy::class, AccessType::Create)]
final readonly class OpenLedger extends Command
{
    public function __construct(public string $title) {}
}
