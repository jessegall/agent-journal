<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use Symfony\Component\Process\Process;

/**
 * One PHPStan run of RawReflectionRule over the given sources and what it found.
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

        $report = json_decode($analysis->getOutput(), true);

        if (! $analysis->isSuccessful() || ! is_array($report)) {
            return new self(0, ["PHPStan did not complete:\n{$analysis->getOutput()}\n{$analysis->getErrorOutput()}"], []);
        }

        $findings = [];

        foreach ($report['findings'] as $finding) {
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

        return new self($report['analysedFiles'], array_values($report['failures']), $findings);
    }

    /**
     * Each finding as a failure shows it: path:line, the operation and the wrapper call to use.
     *
     * @return list<string>
     */
    public function reports(): array
    {
        return array_map(fn (ReflectionFinding $finding) => $finding->report(), $this->findings);
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
