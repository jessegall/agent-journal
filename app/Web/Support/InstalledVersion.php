<?php

declare(strict_types=1);

namespace App\Web\Support;

use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Web\Contracts\InstalledVersion as InstalledVersionContract;
use Illuminate\Contracts\Cache\Repository as Cache;
use Illuminate\Process\Factory as ProcessFactory;

/**
 * Which version of the journal runs here, as the sidebar shows it: the release tag of a commit on main, else the short
 * commit hash. An installation the updater keeps reads .installed-version, which it writes into each build (commit,
 * branch and tag, one per line); a checkout asks git for its HEAD. The answer is cached until the updater clears it
 * after an install, so no request waits on a file or on git.
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
        $installed = $this->files->pathIn(Place::Project, base_path('.installed-version'));

        if ($this->files->exists($installed)) {
            [$commit, $branch, $tag] = array_pad(explode("\n", trim($this->files->read($installed))), 3, '');

            return $branch === 'main' && $tag !== '' ? $tag : substr($commit, 0, self::HASH_LENGTH);
        }

        return substr($this->checkoutCommit(), 0, self::HASH_LENGTH);
    }

    /**
     * The commit a checkout's HEAD names, asked of git itself, since the files layer keeps .git closed.
     */
    private function checkoutCommit(): string
    {
        $git = $this->process->newPendingProcess()->run(['git', '-C', base_path(), 'rev-parse', 'HEAD']);

        return $git->successful() ? trim($git->output()) : 'unknown';
    }
}
