<?php

declare(strict_types=1);

namespace App\Commands\Accounts\RecordThreadTokens;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Values\ReportedStart;
use App\Values\ThreadTokens;

/**
 * A host reports a thread's token count it observed on a start it claimed, kept under that start's saved account. Run
 * for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RecordThreadTokensCommand extends Command
{
    public function __construct(public ReportedStart $start, public ThreadTokens $tokens) {}
}
