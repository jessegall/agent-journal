<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Exceptions\HelperImportFailed;
use App\Agents\Models\CertifiedWork;
use Illuminate\Contracts\Process\ProcessResult;
use Illuminate\Process\Factory;

/**
 * Fetches a certified helper checkout's commits into the parent repository under the work's own ref, as a trusted
 * operation: no hook, config include, credential helper or remote transport runs, and no branch is merged, rebased
 * or pushed. An import that already happened changes nothing.
 */
final readonly class HelperCommitImport
{
    /**
     * The longest one git step of an import may take.
     */
    private const int TIMEOUT_SECONDS = 120;

    /**
     * Git settings that keep the fetch from running anything the checkout or the user's configuration could name.
     */
    private const array SAFE_SETTINGS = [
        'core.hooksPath=/dev/null',
        'core.fsmonitor=false',
        'credential.helper=',
        'protocol.allow=never',
        'protocol.file.allow=always',
        'transfer.fsckObjects=true',
    ];

    public function __construct(
        private Factory $processes,
        private string $repository,
    ) {}

    /**
     * Imports the work's commits once and answers the commits its ref holds that the parent's current branch lacks.
     *
     * @return list<string>
     *
     * @throws HelperImportFailed
     */
    public function import(CertifiedWork $work): array
    {
        $ref = $work->importRef();

        if (! $this->git(['rev-parse', '--verify', '--quiet', $ref])->successful()) {
            $fetch = $this->git([
                'fetch',
                '--no-tags',
                '--no-recurse-submodules',
                '--no-write-fetch-head',
                '--quiet',
                $work->worktree,
                "HEAD:{$ref}",
            ]);

            if ($fetch->failed()) {
                throw HelperImportFailed::for($work->worktree, trim($fetch->errorOutput()));
            }
        }

        $commits = $this->git(['rev-list', '--reverse', $ref, '--not', 'HEAD'])->output();

        return array_values(array_filter(explode("\n", trim($commits))));
    }

    /**
     * @param  list<string>  $arguments
     */
    private function git(array $arguments): ProcessResult
    {
        $settings = array_merge(...array_map(fn (string $setting) => ['-c', $setting], self::SAFE_SETTINGS));

        return $this->processes
            ->newPendingProcess()
            ->path($this->repository)
            ->timeout(self::TIMEOUT_SECONDS)
            ->env(['GIT_CONFIG_NOSYSTEM' => '1', 'GIT_CONFIG_GLOBAL' => '/dev/null', 'GIT_TERMINAL_PROMPT' => '0'])
            ->run(['git', ...$settings, ...$arguments]);
    }
}
