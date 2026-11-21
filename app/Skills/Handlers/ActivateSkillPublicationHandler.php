<?php

declare(strict_types=1);

namespace App\Skills\Handlers;

use App\Contracts\CommandHandler;
use App\Skills\Commands\ActivateSkillPublication;
use App\Skills\Contracts\SkillPublisher;
use App\Skills\Exceptions\SkillPublicationFailed;
use App\Skills\Exceptions\SkillPublicationStale;
use App\Skills\Models\SkillPublication;
use App\Skills\Programs\ProgramSkillAdapters;
use App\Skills\Support\PublicationFiles;
use App\Skills\Support\SkillPublications;
use App\Skills\Support\SkillTargets;

final readonly class ActivateSkillPublicationHandler implements CommandHandler
{
    public function __construct(
        private SkillPublisher $publisher,
        private SkillTargets $targets,
        private ProgramSkillAdapters $adapters,
        private SkillPublications $publications,
    ) {}

    public function handle(ActivateSkillPublication $command): void
    {
        $publication = SkillPublication::lockById($command->publicationId);

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
