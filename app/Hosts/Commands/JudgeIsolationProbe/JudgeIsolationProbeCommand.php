<?php

declare(strict_types=1);

namespace App\Hosts\Commands\JudgeIsolationProbe;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Reads an ended isolation probe: a relay probe that ran opens the sandbox probe, and a sandbox probe, or either that
 * failed, keeps the host's verdict on Claude Code's sandbox and judges its protection again. The probe's container is
 * removed; run when a probe ends or is lost.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class JudgeIsolationProbeCommand extends Command
{
    public function __construct(public string $processId, public string $printed) {}
}
