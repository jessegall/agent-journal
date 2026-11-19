<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Profiles\Handlers\PublishSignInChallengeHandler;

/**
 * The host's runner hands over the challenge its program printed for the attempt it runs, for the person only. Run
 * for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[HandledBy(PublishSignInChallengeHandler::class)]
#[Entry(CommandEntry::HostControl)]
final readonly class PublishSignInChallenge extends Command
{
    public function __construct(
        public string $hostId,
        public string $attemptId,
        public string $address,
        public string|null $code,
    ) {}
}
