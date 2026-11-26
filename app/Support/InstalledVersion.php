<?php

declare(strict_types=1);

namespace App\Support;

use App\Agents\Drivers\Contracts\InstalledVersion as InstalledVersionContract;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use Illuminate\Contracts\Cache\Repository as Cache;
use Illuminate\Process\Factory as ProcessFactory;

/**
 * Which version of the journal runs here: the release tag of a commit on main, else the short commit hash, read from
 * storage/installation/installed-version where the updater keeps it, or from git in a checkout. It is cached until the
 * updater clears it after an install.
 */
final readonly class InstalledVersion implements InstalledVersionContract
{
    public const string CACHE_KEY = 'installed-version';

    private const int HASH_LENGTH = 9;

    public function __construct(
        private Files $files,
        private ProcessFactory $process,
        private Cache $cache,
    ) {}

    public function label(): string
    {
        return $this->cache->rememberForever(self::CACHE_KEY, fn () => $this->readLabel());
    }

    private function readLabel(): string
    {
        $installed = $this->files->pathIn(Place::Project, base_path('storage/installation/installed-version'));

        if ($this->files->exists($installed)) {
            [$commit, $branch, $tag] = array_pad(explode("\n", trim($this->files->read($installed))), 3, '');

            if ($branch === 'main' && $tag !== '') {
                return $tag;
            }

            return substr($commit, 0, self::HASH_LENGTH);
        }

        return substr($this->checkoutCommit(), 0, self::HASH_LENGTH);
    }

    /**
     * The commit a checkout's HEAD names, asked of git itself, since the files layer keeps .git closed.
     */
    private function checkoutCommit(): string
    {
        $git = $this->process->newPendingProcess()->run(['git', '-C', base_path(), 'rev-parse', 'HEAD']);

        if ($git->successful()) {
            return trim($git->output());
        }

        return 'unknown';
    }
}
