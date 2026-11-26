<?php

declare(strict_types=1);

namespace App\Sharing\Commands\ExpireShares;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Sharing\Support\ShareExpiry;
use App\Support\Command;

/**
 * The sharing supervisor expires, oldest first, at most 100 shares and proposals whose deadline has passed, and says
 * whether more are waiting.
 *
 * @extends Command<ShareExpiry>
 */
#[Entry(CommandEntry::ShareGateway)]
final readonly class ExpireSharesCommand extends Command {}
