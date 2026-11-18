<?php

declare(strict_types=1);

namespace Tests\Fixtures\Skills;

use App\Skills\Contracts\SkillPublisher;
use App\Skills\Exceptions\SkillPublicationFailed;

/**
 * A publisher whose disk is full: staging fails, activation and reads pass through.
 */
final readonly class FullDiskPublisher implements SkillPublisher
{
    public function __construct(private SkillPublisher $host) {}

    public function stage(string $stagingFolder, array $files): void
    {
        throw SkillPublicationFailed::write('no space left on device');
    }

    public function activate(string $target, string $stagingFolder): void
    {
        $this->host->activate($target, $stagingFolder);
    }

    public function clear(string $stagingFolder, array $files): void
    {
        $this->host->clear($stagingFolder, $files);
    }

    public function activeFolder(string $target): ?string
    {
        return $this->host->activeFolder($target);
    }
}
