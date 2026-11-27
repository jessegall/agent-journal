<?php

declare(strict_types=1);

namespace App\CommandRules\Rules;

use App\CommandRules\Enums\EmptySelection;
use App\CommandRules\Enums\FramingType;
use App\CommandRules\Enums\Outcome;
use App\CommandRules\Enums\OutputEncoding;
use App\CommandRules\Enums\StreamUse;
use App\CommandRules\Enums\SummaryRule;
use App\CommandRules\Values\EmptyRunPolicy;
use App\CommandRules\Values\ExitBranch;
use App\CommandRules\Values\ExitPolicy;
use App\CommandRules\Values\RecordRule;
use App\CommandRules\Values\ShippedReader;
use App\Records\Enums\RecordRole;
use App\Values\OutputContract;
use App\Values\ReaderDefinition;

/**
 * The readers Core ships for the checks, tests and builds it knows, each bound to the tool version its stored samples
 * were taken from: a reader proven on one version never reads another.
 */
final readonly class ShippedReaders
{
    /**
     * @return list<ShippedReader>
     */
    public function all(): array
    {
        return [
            $this->phpstan(),
            $this->pintCheck(),
            $this->pintFix(),
            $this->phpunit(),
            $this->judge(),
            $this->vueTsc(),
            $this->vpCheck(),
            $this->vpBuild(),
        ];
    }

    /**
     * The shipped reader of a tool for the version installed, or none when it is bound to another version.
     */
    public function forInstalled(string $tool, string $version): ShippedReader|null
    {
        $readers = array_filter($this->all(), fn (ShippedReader $reader) => $reader->tool === $tool);

        return array_find($readers, fn (ShippedReader $reader) => $reader->version === $version);
    }

    private function phpstan(): ShippedReader
    {
        return new ShippedReader(
            'phpstan',
            'core.phpstan.analyse',
            '2.3.6',
            'composer.lock: phpstan/phpstan',
            'vendor/bin/phpstan analyse --error-format=json --no-progress',
            ReaderDefinition::from([
                'rules' => [RecordRule::of(
                    RecordRole::Summary,
                    '{"totals":{"errors":{errors:int},"file_errors":{file_errors:int}}{rest:rest}',
                )],
                'failure_field' => 'file_errors',
            ]),
            self::contract(),
            ExitPolicy::of(self::passed(), self::findings(1)),
        );
    }

    private function pintCheck(): ShippedReader
    {
        return new ShippedReader(
            'pint-test',
            'core.pint.test',
            '1.32.3',
            'composer.lock: laravel/pint',
            'vendor/bin/pint --test --format=junit',
            ReaderDefinition::from(['rules' => self::junitRules(), 'failure_field' => 'failures']),
            self::contract(),
            ExitPolicy::of(self::passed(), self::findings(1)),
        );
    }

    private function pintFix(): ShippedReader
    {
        return new ShippedReader(
            'pint-fix',
            'core.pint.fix',
            '1.32.3',
            'composer.lock: laravel/pint',
            'vendor/bin/pint --format=junit',
            ReaderDefinition::from(['rules' => self::junitRules(), 'failure_field' => 'errors']),
            self::contract(),
            ExitPolicy::of(self::passed()),
        );
    }

    private function phpunit(): ShippedReader
    {
        return new ShippedReader(
            'phpunit',
            'core.phpunit',
            '13.4.8',
            'composer.lock: phpunit/phpunit',
            'vendor/bin/phpunit --teamcity',
            ReaderDefinition::from([
                'rules' => [
                    RecordRule::of(
                        RecordRole::AllowedNoise,
                        'PHPUnit {version:word} by Sebastian Bergmann and contributors.',
                    ),
                    RecordRule::of(RecordRole::AllowedNoise, 'Runtime:       PHP {php:word}'),
                    RecordRule::of(RecordRole::Diagnostic, '##teamcity[testFailed {details:rest}'),
                    RecordRule::of(RecordRole::AllowedNoise, '##teamcity[{event:rest}'),
                    RecordRule::of(RecordRole::AllowedNoise, 'Time: {time:rest}'),
                    RecordRule::of(RecordRole::Diagnostic, 'There was {count:int} failure:'),
                    RecordRule::of(RecordRole::Diagnostic, 'There were {count:int} failures:'),
                    RecordRule::of(RecordRole::Diagnostic, '{number:int}) {test:rest}'),
                    RecordRule::of(RecordRole::Diagnostic, 'Failed asserting {message:rest}'),
                    RecordRule::of(RecordRole::Diagnostic, '/{location:rest}'),
                    RecordRule::of(RecordRole::Outcome, 'FAILURES{failed:rest}'),
                    RecordRule::of(RecordRole::Outcome, 'OK{passed:rest}'),
                    RecordRule::of(
                        RecordRole::Summary,
                        'Tests: {tests:int}, Assertions: {assertions:int}, Failures: {failures:int}.',
                    ),
                ],
                'failure_field' => 'failures',
            ]),
            self::contract(),
            ExitPolicy::of(self::passed(), self::findings(1)),
        );
    }

    private function judge(): ShippedReader
    {
        return new ShippedReader(
            'commandments-judge',
            'core.commandments.judge',
            '7.18.152',
            'the code-commandments plugin binary',
            'COMMANDMENTS_PLAIN_PROGRESS=1 commandments-release judge',
            ReaderDefinition::from([
                'rules' => [
                    RecordRule::of(RecordRole::AllowedNoise, '{phase:word} {done:int}/{total:int}'),
                    RecordRule::of(
                        RecordRole::Summary,
                        '· read {files:int} file{read:text}: {sins:int} sin{plural:rest}',
                    ),
                    RecordRule::of(
                        RecordRole::Diagnostic,
                        '{file:text}, line {line:int}: {message:text} [{rule:text}]',
                    ),
                    RecordRule::of(
                        RecordRole::AllowedNoise,
                        '{sins:int} sin{plural:text} in {files:int} file{files_plural:rest}',
                    ),
                    RecordRule::of(RecordRole::AllowedNoise, '↳ checklist written to {path:rest}'),
                    RecordRule::of(RecordRole::Outcome, '✓ No sins found in {passed:rest}'),
                ],
                'failure_field' => 'sins',
            ]),
            self::contract(),
            ExitPolicy::of(self::passed(), self::findings(1)),
        );
    }

    private function vueTsc(): ShippedReader
    {
        return new ShippedReader(
            'vue-tsc',
            'core.vue-tsc',
            '3.3.14',
            'package-lock.json: vue-tsc',
            'vue-tsc --noEmit',
            ReaderDefinition::from([
                'rules' => [
                    RecordRule::of(
                        RecordRole::Outcome,
                        '{file:text}({line:int},{column:int}): {failed:word} TS{code:int}: {message:rest}',
                    ),
                ],
            ]),
            self::contract(EmptyRunPolicy::allowedSuccess('no type errors')),
            ExitPolicy::of(self::passed(), self::findings(2)),
        );
    }

    private function vpCheck(): ShippedReader
    {
        return new ShippedReader(
            'vp-check',
            'core.vp.check',
            '1.4.0',
            'package-lock.json: vite-plus',
            'vp check',
            ReaderDefinition::from([
                'rules' => [
                    RecordRule::of(RecordRole::Outcome, 'pass: {passed:rest}'),
                    RecordRule::of(RecordRole::Outcome, 'error: {failed:text} issues found'),
                    RecordRule::of(RecordRole::Diagnostic, '{file:word} ({milliseconds:int}ms)'),
                    RecordRule::of(RecordRole::AllowedNoise, 'Found formatting issues in {rest:rest}'),
                ],
            ]),
            self::contract(),
            ExitPolicy::of(self::passed(), self::findings(1)),
        );
    }

    private function vpBuild(): ShippedReader
    {
        return new ShippedReader(
            'vp-build',
            'core.vp.build',
            '1.4.0',
            'package-lock.json: vite-plus',
            'vp build',
            ReaderDefinition::from([
                'rules' => [
                    RecordRule::of(RecordRole::AllowedNoise, 'note: {note:rest}'),
                    RecordRule::of(RecordRole::AllowedNoise, 'transforming...'),
                    RecordRule::of(RecordRole::AllowedNoise, 'rendering chunks...'),
                    RecordRule::of(RecordRole::AllowedNoise, 'computing gzip size...'),
                    RecordRule::of(RecordRole::AllowedNoise, '✓ {modules:int} modules transformed.'),
                    RecordRule::of(RecordRole::Outcome, '✓ built in {passed:rest}'),
                    RecordRule::of(RecordRole::Diagnostic, '{file:word} {size:rest}'),
                ],
            ]),
            self::contract(),
            ExitPolicy::of(self::passed()),
        );
    }

    /**
     * @return list<RecordRule>
     */
    private static function junitRules(): array
    {
        return [
            RecordRule::of(RecordRole::AllowedNoise, '<?xml version="1.0" encoding="UTF-8"?>'),
            RecordRule::of(RecordRole::AllowedNoise, '<testsuites>'),
            RecordRule::of(RecordRole::AllowedNoise, '</testsuites>'),
            RecordRule::of(RecordRole::AllowedNoise, '    <properties>'),
            RecordRule::of(RecordRole::AllowedNoise, '    </properties>'),
            RecordRule::of(RecordRole::AllowedNoise, '  </testsuite>'),
            RecordRule::of(RecordRole::AllowedNoise, '    </testcase>'),
            RecordRule::of(RecordRole::AllowedNoise, '      <property name="about" value={about:rest}'),
            RecordRule::of(
                RecordRole::Summary,
                '  <testsuite name="PHP CS Fixer" tests="{tests:int}" assertions="{assertions:int}" failures="{failures:int}" errors="{errors:int}">',
            ),
            RecordRule::of(RecordRole::Diagnostic, '    <testcase name="All OK" assertions="{assertions:int}"/>'),
            RecordRule::of(
                RecordRole::Diagnostic,
                '    <testcase name="{name:word}" file="{file:word}" assertions="{assertions:int}">',
            ),
            RecordRule::of(RecordRole::Diagnostic, '      <failure type="{type:word}"><![CDATA[{message:rest}'),
        ];
    }

    private static function contract(EmptyRunPolicy|null $empty = null): OutputContract
    {
        return OutputContract::from([
            'encoding' => OutputEncoding::Utf8,
            'framing' => FramingType::Lines,
            'schema_versions' => '*',
            'streams' => StreamUse::MergeAllowed,
            'summary' => SummaryRule::NotRequired,
            'empty' => $empty ?? EmptyRunPolicy::invalid(),
            'empty_selection' => EmptySelection::ConfigurationProblem,
        ]);
    }

    private static function passed(): ExitBranch
    {
        return ExitBranch::of(0, Outcome::Passed, 'the output claims no failures');
    }

    private static function findings(int $status): ExitBranch
    {
        return ExitBranch::of($status, Outcome::Findings, 'the output claims failures');
    }
}
