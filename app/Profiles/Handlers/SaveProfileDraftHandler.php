<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Profiles\Commands\SaveProfileDraft;
use App\Profiles\Models\ProfileDraft;
use App\Profiles\Models\ProfileDraftRevision;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ScriptSource;

final readonly class SaveProfileDraftHandler implements CommandHandler
{
    public function handle(SaveProfileDraft $command): int
    {
        return $this->saveFor(
            $command->profile,
            $command->expectedRevision,
            $command->source,
            ActorIdentity::of($command->dispatchedBy()),
        );
    }

    private function saveFor(ProfileKey $profile, int $expected, ScriptSource $source, ActorIdentity $author): int
    {
        $draft = ProfileDraft::lockForProfiles([$profile->key])[$profile->key];
        $draft->sourceAt($expected);
        $revision = ProfileDraftRevision::create($draft, $source, $author);
        $draft->revision = $revision->revision;
        $draft->current_revision_id = $revision->id;
        $draft->save();

        return $revision->revision;
    }
}
