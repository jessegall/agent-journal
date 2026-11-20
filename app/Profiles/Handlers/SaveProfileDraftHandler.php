<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Profiles\Commands\SaveProfileDraft;
use App\Profiles\Models\ProfileDraft;

final readonly class SaveProfileDraftHandler implements CommandHandler
{
    public function handle(SaveProfileDraft $command): int
    {
        return ProfileDraft::saveFor(
            $command->profile,
            $command->expectedRevision,
            $command->source,
            ActorIdentity::of($command->dispatchedBy()),
        );
    }
}
