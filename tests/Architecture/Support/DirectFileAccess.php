<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Files\Enums\PlaceExemption;
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
     * @param  array<string, list<array{line: int, form: string, instead: string, exemption: string|null}>>  $findings  by path from the root
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
     * Each file and form found, as the list writes them, sorted: a site still waiting to move as 'path form', and a
     * site the user settled as outside the places as 'exempt Reason path form', which sorts after them.
     *
     * @return list<string>
     */
    public function sites(): array
    {
        $sites = [];

        foreach ($this->findings as $path => $found) {
            foreach ($found as $finding) {
                $sites[] = self::lineOf($path, $finding);
            }
        }

        $sites = array_values(array_unique($sites));
        sort($sites);

        return $sites;
    }

    /**
     * The sites the list holds, its comment lines left out.
     *
     * @return list<string>
     */
    public function listedSites(): array
    {
        $lines = file("{$this->projectRoot}/".self::WAITING_LIST, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];

        return array_values(array_filter($lines, fn (string $line) => ! str_starts_with($line, '#')));
    }

    /**
     * What differs from the list: each new site with its lines and the Files method to use instead, and each listed
     * site the code no longer has.
     */
    public function report(): string
    {
        $listed = $this->listedSites();
        $lines = [];

        foreach ($this->findings as $path => $found) {
            foreach ($found as $finding) {
                if (! in_array(self::lineOf($path, $finding), $listed, true)) {
                    $lines[] = "  new: {$path}:{$finding['line']} {$finding['form']}, use {$finding['instead']}";
                }
            }
        }

        foreach (array_diff($listed, $this->sites()) as $gone) {
            $lines[] = "  gone: {$gone} is listed but no longer in the code; remove its line from ".self::WAITING_LIST;
        }

        return implode("\n", $lines);
    }

    /**
     * The list as it is written: a header with the counts, then one site per line, the exempt ones last.
     */
    public function listText(): string
    {
        $sites = $this->sites();
        $exempt = count(array_filter($sites, fn (string $site) => str_starts_with($site, 'exempt ')));
        $waiting = count($sites) - $exempt;

        return <<<TEXT
        # The direct file access sites outside app/Files (plan 39): {$waiting} still waiting to move to App\\Files\\Contracts\\Files,
        # and {$exempt} exempt. One line per file and form, without line numbers. A task that moves a site removes its own
        # lines here, in the same task; the waiting part only shrinks. An 'exempt' line names a method marked
        # #[OutsideThePlaces(PlaceExemption::...)], for a reason the user settled (doc 69).
        # tests/Architecture/DirectFileAccessTest.php fails on a site that is not listed and on a listed site the code no
        # longer has. Regenerate with: php tools/refactoring/direct-file-sites.php --write
        # The exemptions:

        TEXT.self::exemptionLines().implode("\n", $sites)."\n";
    }

    /**
     * One comment line per exemption the user settled, with its reason.
     */
    private static function exemptionLines(): string
    {
        $lines = array_map(
            fn (PlaceExemption $exemption) => "#   {$exemption->name}: {$exemption->description()}\n",
            PlaceExemption::cases(),
        );

        return implode('', $lines)."\n";
    }

    /**
     * @param  array{line: int, form: string, instead: string, exemption: string|null}  $finding
     */
    private static function lineOf(string $path, array $finding): string
    {
        return $finding['exemption'] === null
            ? "{$path} {$finding['form']}"
            : "exempt {$finding['exemption']} {$path} {$finding['form']}";
    }
}
