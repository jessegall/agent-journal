<?php

declare(strict_types=1);

namespace App\Profiles\Commands\SaveProfileDraft;

use App\Bus\Contracts\CommandHandler;
use App\Models\Profiles\ProfileDraft;
use App\Models\Profiles\ProfileDraftRevision;
use App\Support\ActorReference;
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
            $command->dispatchedBy(),
        );
    }

    private function saveFor(ProfileKey $profile, int $expected, ScriptSource $source, ActorReference $author): int
    {
        $draft = ProfileDraft::createForProfiles([$profile->key])[$profile->key];
        $draft->sourceAt($expected);
        $revision = ProfileDraftRevision::create($draft, $source, $author);
        $draft->revision = $revision->revision;
        $draft->current_revision_id = $revision->id;
        $draft->save();

        return $revision->revision;
    }
}
