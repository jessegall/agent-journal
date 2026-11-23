<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Work\HelperCommitImport as HelperCommitImportContract;
use App\Exceptions\HelperImportFailed;
use App\Exceptions\HelperWorkUncertified;
use App\Models\Reviews\CertifiedWork;
use App\Values\HelperImportReceipt;
use Illuminate\Contracts\Process\ProcessResult;
use Illuminate\Process\Factory;

/**
 * Fetches a certified helper checkout's commits into the parent repository under the work's own ref, as a trusted
 * operation: no hook, config include, credential helper or remote transport runs, and no branch is merged, rebased
 * or pushed. An import that already happened changes nothing.
 */
final readonly class HelperCommitImport implements HelperCommitImportContract
{
    /**
     * The longest one git step of an import may take.
     */
    private const int STEP_SECONDS_LIMIT = 120;

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
     * Imports the commits of certified work once and answers its ref, the parent's head it is compared with, its own
     * head, and the commits it holds that the parent's current branch lacks.
     *
     * @throws HelperWorkUncertified
     * @throws HelperImportFailed
     */
    public function importCertified(RecordIdentity $work, string $certificate): HelperImportReceipt
    {
        $certified = CertifiedWork::of($work, $certificate);
        $commits = $this->import($certified);

        return new HelperImportReceipt(
            $certified->importRef(),
            $this->revision('HEAD'),
            $this->revision($certified->importRef()),
            $commits,
        );
    }

    /**
     * Copies a commit of the parent repository into the certified work's checkout under refs/journal/repair/<source>,
     * the same protected way the import works in the other direction; nothing in the checkout is reset or merged.
     *
     * @throws HelperWorkUncertified
     * @throws HelperImportFailed
     */
    public function transferTarget(RecordIdentity $work, string $certificate, string $commit, string $source): string
    {
        $certified = CertifiedWork::of($work, $certificate);
        $ref = "refs/journal/repair/{$source}";

        $fetch = $this->git(
            ['fetch', '--no-tags', '--quiet', $this->repository, "{$commit}:{$ref}"],
            $certified->worktree,
        );

        if ($fetch->failed()) {
            throw HelperImportFailed::for($this->repository, trim($fetch->errorOutput()));
        }

        return $ref;
    }

    /**
     * @return list<string>
     *
     * @throws HelperImportFailed
     */
    private function import(CertifiedWork $work): array
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

    private function revision(string $name): string
    {
        return trim($this->git(['rev-parse', '--verify', '--quiet', $name])->output());
    }

    /**
     * @param  list<string>  $arguments
     */
    private function git(array $arguments, string|null $folder = null): ProcessResult
    {
        return $this->processes
            ->newPendingProcess()
            ->path($folder ?? $this->repository)
            ->timeout(self::STEP_SECONDS_LIMIT)
            ->env(['GIT_CONFIG_NOSYSTEM' => '1', 'GIT_CONFIG_GLOBAL' => '/dev/null', 'GIT_TERMINAL_PROMPT' => '0'])
            ->run(['git', ...$this->settings(), ...$arguments]);
    }

    /**
     * @return list<string>
     */
    private function settings(): array
    {
        return array_merge(...array_map(fn (string $setting) => ['-c', $setting], self::SAFE_SETTINGS));
    }
}
