<?php

declare(strict_types=1);

namespace App\Profiles\Commands\RecordThreadTokens;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Profiles\Values\ReportedStart;
use App\Profiles\Values\ThreadTokens;

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
