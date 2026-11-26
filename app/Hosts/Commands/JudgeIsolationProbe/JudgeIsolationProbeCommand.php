<?php

declare(strict_types=1);

namespace App\Hosts\Commands\JudgeIsolationProbe;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Reads an ended isolation probe: a relay probe that ran opens the sandbox probe; a sandbox probe that ran, or either
 * that failed, keeps the host's verdict on Claude Code's sandbox in the agent image and judges its protection again.
 * The probe's container is removed. Run by the probe's driver when it ends, and for a probe the host lost
 * (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class JudgeIsolationProbeCommand extends Command
{
    public function __construct(public string $processId, public string $printed) {}
}
