<?php

declare(strict_types=1);

namespace App\Skills\Handlers;

use App\Contracts\CommandHandler;
use App\Skills\Commands\PrepareSkillPublication;
use App\Skills\Contracts\SkillPublisher;
use App\Skills\Exceptions\SkillPublicationStale;
use App\Skills\Models\SkillGeneration;
use App\Skills\Models\SkillPublication;
use App\Skills\Support\PublicationFiles;
use App\Skills\Support\SkillTargets;
use App\Skills\Values\PreparationProgress;

final readonly class PrepareSkillPublicationHandler implements CommandHandler
{
    private const int MOST_FILES = 64;

    public function __construct(
        private SkillPublisher $publisher,
        private SkillTargets $targets,
    ) {}

    public function handle(PrepareSkillPublication $command): PreparationProgress
    {
        $publication = SkillPublication::lockById($command->publicationId);

        if (! $publication->isHeldBy($command->fence)) {
            throw SkillPublicationStale::for($command->fence, $publication->fencing_version);
        }

        $files = PublicationFiles::of($publication, SkillGeneration::query()->whereKey($publication->generation_id)->firstOrFail(), $this->targets);
        $batch = $files->batchAfter($publication->progress, self::MOST_FILES);
        $this->publisher->stage($files->stagingFolder, $batch);
        $staged = $publication->progress + count($batch);
        $publication->recordProgress($command->fence, $staged);

        return new PreparationProgress($staged, $files->count());
    }
}
