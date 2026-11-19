<?php

declare(strict_types=1);

namespace App\Sharing\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Enums\CommandEntry;
use App\Sharing\Handlers\ExpireSharesHandler;
use App\Sharing\Support\ShareExpiry;

/**
 * The sharing supervisor expires, oldest first, at most 100 shares and proposals whose deadline has passed, and says
 * whether more are waiting.
 *
 * @implements Command<ShareExpiry>
 */
#[HandledBy(ExpireSharesHandler::class)]
#[Entry(CommandEntry::ShareGateway)]
final readonly class ExpireShares implements Command {}
