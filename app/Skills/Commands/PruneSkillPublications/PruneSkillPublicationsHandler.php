<?php

declare(strict_types=1);

namespace App\Skills\Commands\PruneSkillPublications;

use App\Agents\Drivers\Skills\DriverSkillAdapters;
use App\Bus\Contracts\CommandHandler;
use App\Models\Skills\SkillPublication;
use App\Skills\Contracts\SkillPublisher;
use App\Skills\Exceptions\SkillPublicationFailed;
use App\Skills\PublicationFiles;
use App\Skills\SkillTargets;
use App\Skills\Values\PrunedPublications;
use Carbon\CarbonImmutable;

final readonly class PruneSkillPublicationsHandler implements CommandHandler
{
    private const int MOST_PUBLICATIONS = 500;

    private const int DELIVERED_KEPT_PER_TARGET = 2;

    private const int RETENTION_DAYS = 30;

    public function __construct(
        private SkillPublisher $publisher,
        private SkillTargets $targets,
        private DriverSkillAdapters $adapters,
    ) {}

    public function handle(PruneSkillPublicationsCommand $command): PrunedPublications
    {
        $retentionStart = CarbonImmutable::now()->subDays(self::RETENTION_DAYS);
        $keptPerTarget = [];
        $retired = 0;
        $conflicts = [];

        foreach (SkillPublication::findSettled(self::MOST_PUBLICATIONS) as $publication) {
            $target = $publication->targetName;
            $keptPerTarget[$target] ??= 0;

            if ($publication->wasDelivered() && $keptPerTarget[$target] < self::DELIVERED_KEPT_PER_TARGET) {
                $keptPerTarget[$target]++;

                continue;
            }

            if ($publication->awaitsRetry($retentionStart)) {
                continue;
            }

            $files = PublicationFiles::of($publication, $this->targets, $this->adapters);

            try {
                $this->publisher->clear($files->stagingFolder, $files->files);
            } catch (SkillPublicationFailed $changed) {
                $conflicts[] = $changed->getMessage();

                continue;
            }

            if ($publication->endedBefore($retentionStart)) {
                $publication->retire();
                $retired++;
            }
        }

        return new PrunedPublications($retired, $conflicts);
    }
}
