<?php

declare(strict_types=1);

namespace App\Hosts\Commands\JudgeHostProtection;

use App\Accounts\Enums\CommandEntry;
use App\Agents\Drivers\Enums\IsolationPlatform;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Judges the protection of a driver family's pinned build on a platform of a contained host, from the platform's
 * mechanisms, the host's sandbox verdict for the agent image and the runs recorded on it, and keeps the report the
 * contained starts are checked against (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class JudgeHostProtectionCommand extends Command
{
    public function __construct(public string $hostId, public string $family, public IsolationPlatform $platform) {}
}
