<?php

declare(strict_types=1);

namespace App\Commands\Skills\PrepareSkillPublication;

use App\Agents\Drivers\Skills\DriverSkillAdapters;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Skills\SkillPublisher;
use App\Exceptions\SkillPublicationStale;
use App\Models\Skills\SkillPublication;
use App\Support\PublicationFiles;
use App\Support\SkillTargets;
use App\Values\PreparationProgress;

final readonly class PrepareSkillPublicationHandler implements CommandHandler
{
    private const int MOST_FILES = 64;

    public function __construct(
        private SkillPublisher $publisher,
        private SkillTargets $targets,
        private DriverSkillAdapters $adapters,
    ) {}

    public function handle(PrepareSkillPublicationCommand $command): PreparationProgress
    {
        $publication = SkillPublication::findLockedById($command->publicationId);

        if (! $publication->isHeldBy($command->fence)) {
            throw SkillPublicationStale::for($command->fence, $publication->fencing_version);
        }

        $files = PublicationFiles::of($publication, $this->targets, $this->adapters);
        $batch = $files->batchAfter($publication->progress, self::MOST_FILES);
        $this->publisher->stage($files->stagingFolder, $batch);
        $staged = $publication->progress + count($batch);
        $publication->recordProgress($command->fence, $staged);

        return new PreparationProgress($staged, $files->count());
    }
}
