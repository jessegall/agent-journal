<?php

declare(strict_types=1);

namespace App\Profiles\Commands\PublishSignInChallenge;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * The host's runner hands over the challenge its driver printed for the attempt it runs, for the user only. Run
 * for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class PublishSignInChallengeCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $attemptId,
        public string $address,
        public string|null $code,
    ) {}
}
