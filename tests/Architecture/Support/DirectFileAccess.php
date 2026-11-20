<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use Tests\Support\ScanCache\ScanCache;

/**
 * The direct file access sites of the project's code, found by FileFunctionScan, against the checked-in list of the
 * sites still waiting to move to the Files funnel. A site is one file and one form, without a line number, so an
 * unrelated edit never changes the list.
 */
final readonly class DirectFileAccess
{
    public const string WAITING_LIST = 'docs/naming/direct-file-access-sites.txt';

    /**
     * @param  array<string, list<array{line: int, form: string, instead: string}>>  $findings  by path from the root
     */
    private function __construct(private string $projectRoot, private array $findings) {}

    /**
     * The findings in app/ and every domain's src folder.
     */
    public static function across(string $projectRoot): self
    {
        $folders = ["{$projectRoot}/app", ...glob("{$projectRoot}/domain/*/src", GLOB_ONLYDIR) ?: []];
        $findings = [];

        foreach (ScanCache::findingsByFile(new FileFunctionScan(), DomainFiles::in($folders)) as $path => $found) {
            if ($found !== []) {
                $findings[substr($path, strlen($projectRoot) + 1)] = $found;
            }
        }

        return new self($projectRoot, $findings);
    }

    /**
     * The same findings without those of one folder, given from the project root.
     */
    public function outside(string $folder): self
    {
        return new self($this->projectRoot, array_filter(
            $this->findings,
            fn (string $path) => ! str_starts_with($path, rtrim($folder, '/').'/'),
            ARRAY_FILTER_USE_KEY,
        ));
    }

    /**
     * Each file and form found, as the waiting list writes them, sorted.
     *
     * @return list<string>
     */
    public function sites(): array
    {
        $sites = [];

        foreach ($this->findings as $path => $found) {
            foreach ($found as $finding) {
                $sites[] = "{$path} {$finding['form']}";
            }
        }

        $sites = array_values(array_unique($sites));
        sort($sites);

        return $sites;
    }

    /**
     * The sites the waiting list holds, its comment lines left out.
     *
     * @return list<string>
     */
    public function waitingSites(): array
    {
        $lines = file("{$this->projectRoot}/".self::WAITING_LIST, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];

        return array_values(array_filter($lines, fn (string $line) => ! str_starts_with($line, '#')));
    }

    /**
     * What differs from the waiting list: each new site with its lines and the Files method to use instead, and each
     * listed site the code no longer has.
     */
    public function report(): string
    {
        $waiting = $this->waitingSites();
        $lines = [];

        foreach ($this->findings as $path => $found) {
            foreach ($found as $finding) {
                if (! in_array("{$path} {$finding['form']}", $waiting, true)) {
                    $lines[] = "  new: {$path}:{$finding['line']} {$finding['form']}, use {$finding['instead']}";
                }
            }
        }

        foreach (array_diff($waiting, $this->sites()) as $gone) {
            $lines[] = "  gone: {$gone} is listed but no longer in the code; remove its line from ".self::WAITING_LIST;
        }

        return implode("\n", $lines);
    }

    /**
     * The waiting list as it is written: a header with the counts, then one site per line.
     */
    public function listText(): string
    {
        $sites = $this->sites();
        $files = count($this->findings);
        $count = count($sites);

        return <<<TEXT
        # The direct file access sites still waiting to move to App\\Files\\Contracts\\Files (plan 39): {$files} files, {$count} sites.
        # One line per file and form, without line numbers. A task that moves a site removes its own lines here, in the same task;
        # the list only shrinks. tests/Architecture/DirectFileAccessTest.php fails on a site that is not listed and on a listed
        # site the code no longer has. Regenerate with: php tools/refactoring/direct-file-sites.php --write

        TEXT.implode("\n", $sites)."\n";
    }
}
