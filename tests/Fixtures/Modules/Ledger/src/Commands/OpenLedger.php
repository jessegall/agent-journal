<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Ledger\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Tests\Fixtures\Modules\Ledger\Handlers\OpenLedgerHandler;

/**
 * Opens a ledger and answers its id.
 *
 * @implements Command<string>
 */
#[HandledBy(OpenLedgerHandler::class)]
final readonly class OpenLedger implements Command
{
    public function __construct(public string $title) {}
}
