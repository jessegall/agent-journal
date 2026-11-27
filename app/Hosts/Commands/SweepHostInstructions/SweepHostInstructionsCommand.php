<?php

declare(strict_types=1);

namespace App\Hosts\Commands\SweepHostInstructions;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Expires every open instruction whose expiry passed on the journal's clock and deletes answered instructions past their
 * retention. Run by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class SweepHostInstructionsCommand extends Command {}
