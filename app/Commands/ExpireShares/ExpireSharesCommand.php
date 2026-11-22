<?php

declare(strict_types=1);

namespace App\Commands\ExpireShares;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;
use App\Support\ShareExpiry;

/**
 * The sharing supervisor expires, oldest first, at most 100 shares and proposals whose deadline has passed, and says
 * whether more are waiting.
 *
 * @extends Command<ShareExpiry>
 */
#[Entry(CommandEntry::ShareGateway)]
final readonly class ExpireSharesCommand extends Command {}
