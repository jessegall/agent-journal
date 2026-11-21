<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use Symfony\Component\Process\Process;

/**
 * One PHPStan run of RawReflectionRule over the given sources, and how its findings compare with the baseline of
 * allowed existing uses.
 */
final readonly class ReflectionScan
{
    /**
     * @param  list<string>  $failures  what kept the analysis from completing
     * @param  list<ReflectionFinding>  $findings  sorted by path, line and operation
     */
    private function __construct(public int $analysedFiles, public array $failures, public array $findings) {}

    /**
     * @param  list<string>  $sources  paths relative to the root
     */
    public static function of(string $root, array $sources): self
    {
        $configuration = "{$root}/storage/framework/cache/reflection-boundary.neon";
        file_put_contents($configuration, self::configurationFor($root, $sources));

        $analysis = new Process([
            PHP_BINARY,
            'vendor/bin/phpstan',
            'analyse',
            '--configuration='.$configuration,
            '--error-format=reflectionFindings',
            '--no-progress',
            '--memory-limit=2G',
        ], $root, timeout: 580);
        $analysis->run();

        $result = json_decode($analysis->getOutput(), true);

        if (! $analysis->isSuccessful() || ! is_array($result)) {
            return new self(0, ["PHPStan did not complete:\n{$analysis->getOutput()}\n{$analysis->getErrorOutput()}"], []);
        }

        $findings = [];

        foreach ($result['findings'] as $finding) {
            $file = substr($finding['file'], strlen($root) + 1);
            $findings["{$file}:{$finding['line']}:{$finding['declaration']}:{$finding['operation']}"] = new ReflectionFinding(
                $file,
                $finding['line'],
                $finding['declaration'],
                $finding['operation'],
                $finding['message'],
            );
        }

        $findings = array_values($findings);
        usort($findings, fn (ReflectionFinding $first, ReflectionFinding $second) => $first->sortsBefore($second));

        return new self($result['analysedFiles'], array_values($result['failures']), $findings);
    }

    /**
     * Each finding the baseline does not allow, or allows fewer times than it occurs, as a failure shows it.
     *
     * @param  list<string>  $baseline  lines of file | declaration | operation | count
     * @return list<string>
     */
    public function unlistedFindings(array $baseline): array
    {
        $allowed = self::countsOf($baseline);
        $found = $this->counts();

        return array_values(array_map(
            fn (ReflectionFinding $finding) => $finding->report(),
            array_filter(
                $this->findings,
                fn (ReflectionFinding $finding) => $found[$finding->key()] > ($allowed[$finding->key()] ?? 0),
            ),
        ));
    }

    /**
     * Each baseline line whose uses are gone or fewer than it says, with the count found now.
     *
     * @param  list<string>  $baseline
     * @return list<string>
     */
    public function staleEntries(array $baseline): array
    {
        $found = $this->counts();
        $stale = [];

        foreach (self::countsOf($baseline) as $key => $count) {
            if (($found[$key] ?? 0) < $count) {
                $stale[] = "{$key} | {$count}: found ".($found[$key] ?? 0);
            }
        }

        return $stale;
    }

    /**
     * The baseline lines that would allow exactly the findings of this scan, sorted by path.
     *
     * @return list<string>
     */
    public function baselineLines(): array
    {
        $lines = array_map(fn (string $key, int $count) => "{$key} | {$count}", array_keys($this->counts()), $this->counts());
        sort($lines);

        return $lines;
    }

    /**
     * @return array<string, int>
     */
    private function counts(): array
    {
        return array_count_values(array_map(fn (ReflectionFinding $finding) => $finding->key(), $this->findings));
    }

    /**
     * @param  list<string>  $baseline
     * @return array<string, int>
     */
    private static function countsOf(array $baseline): array
    {
        $counts = [];

        foreach ($baseline as $line) {
            $separator = strrpos($line, ' | ');
            $counts[substr($line, 0, (int) $separator)] = (int) substr($line, (int) $separator + 3);
        }

        return $counts;
    }

    /**
     * @param  list<string>  $sources
     */
    private static function configurationFor(string $root, array $sources): string
    {
        $paths = implode("\n", array_map(fn (string $source) => "        - '{$root}/{$source}'", $sources));

        return <<<NEON
        includes:
            - '{$root}/vendor/larastan/larastan/extension.neon'
            - '{$root}/vendor/nesbot/carbon/extension.neon'

        parameters:
            customRulesetUsed: true
            tmpDir: '{$root}/storage/framework/cache/phpstan-reflection-boundary'
            paths:
        {$paths}

        rules:
            - Tests\\Architecture\\PhpStan\\RawReflectionRule

        services:
            errorFormatter.reflectionFindings:
                class: Tests\\Architecture\\PhpStan\\ReflectionFindingsFormatter

        NEON;
    }
}
