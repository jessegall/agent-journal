<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Profiles\Enums\SignInOutcome;
use App\Profiles\Handlers\ReportSignInHandler;

/**
 * The host's sign-in runner reports a safe outcome of the attempt it runs, in the generation it ran in: waiting for
 * the person, verified by the program's own check outside any transaction, or failed. Run for an authenticated host
 * by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[HandledBy(ReportSignInHandler::class)]
#[Entry(CommandEntry::HostControl)]
final readonly class ReportSignIn extends Command
{
    public function __construct(
        public string $hostId,
        public string $attemptId,
        public int $generation,
        public SignInOutcome $outcome,
        public string|null $identity = null,
    ) {}
}
