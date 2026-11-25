<?php

declare(strict_types=1);

namespace App\Commands\Skills\ActivateSkillPublication;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Skills\SkillPublisher;
use App\Exceptions\SkillPublicationFailed;
use App\Exceptions\SkillPublicationStale;
use App\Models\Skills\SkillPublication;
use App\Support\Drivers\DriverSkillAdapters;
use App\Support\PublicationFiles;
use App\Support\SkillPublications;
use App\Support\SkillTargets;

final readonly class ActivateSkillPublicationHandler implements CommandHandler
{
    public function __construct(
        private SkillPublisher $publisher,
        private SkillTargets $targets,
        private DriverSkillAdapters $adapters,
        private SkillPublications $publications,
    ) {}

    public function handle(ActivateSkillPublicationCommand $command): void
    {
        $publication = SkillPublication::findLockedById($command->publicationId);

        if (! $publication->isHeldBy($command->fence)) {
            throw SkillPublicationStale::for($command->fence, $publication->fencing_version);
        }

        $files = PublicationFiles::of($publication, $this->targets, $this->adapters);

        if ($publication->progress < $files->count()) {
            throw SkillPublicationFailed::write("only {$publication->progress} of {$files->count()} files are staged");
        }

        if ($this->publisher->activeFolder($publication->target) !== $files->stagingFolder) {
            $this->publisher->activate($publication->target, $files->stagingFolder);
        }

        $this->publications->deliver($publication, $command->fence, $files->manifest);
    }
}
