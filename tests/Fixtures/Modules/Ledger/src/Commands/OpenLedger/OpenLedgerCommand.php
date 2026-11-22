<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Ledger\Commands\OpenLedger;

use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use Tests\Fixtures\Modules\Ledger\Models\Ledger;
use Tests\Fixtures\Modules\Ledger\Policies\LedgerPolicy;

/**
 * Opens a ledger and answers its id.
 *
 * @extends Command<string>
 */
#[Authorize(LedgerPolicy::class, AccessType::Create)]
final readonly class OpenLedgerCommand extends Command
{
    public function __construct(public string $title) {}
}
