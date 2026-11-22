<?php

declare(strict_types=1);

namespace App\Commands\SaveProfileDraft;

use App\Contracts\Bus\CommandHandler;
use App\Models\ProfileDraft;
use App\Models\ProfileDraftRevision;
use App\Support\ActorIdentity;
use App\Values\ProfileKey;
use App\Values\ScriptSource;

final readonly class SaveProfileDraftHandler implements CommandHandler
{
    public function handle(SaveProfileDraftCommand $command): int
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
