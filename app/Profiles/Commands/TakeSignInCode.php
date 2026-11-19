<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Profiles\Handlers\TakeSignInCodeHandler;

/**
 * The host's runner takes the code the person typed for the attempt it runs, once; nothing while none waits. Run for
 * an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<string|null>
 */
#[HandledBy(TakeSignInCodeHandler::class)]
#[Entry(CommandEntry::HostControl)]
final readonly class TakeSignInCode extends Command
{
    public function __construct(
        public string $hostId,
        public string $attemptId,
    ) {}
}
