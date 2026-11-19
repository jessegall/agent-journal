<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Processes\Contracts\AliasResolver;
use App\Processes\Contracts\CommandClassifier;
use App\Processes\Contracts\ShellSyntax;
use App\Processes\Enums\ParseOutcome;
use App\Processes\Enums\ShellDialect;
use App\Processes\Values\ExecutionContext;
use App\Processes\Values\ShellNode;
use Tests\Fixtures\Processes\NoAliases;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Every case of the portable shell corpus goes through the container's ShellSyntax and must read as its frozen
 * expectation says: the outcome, and for a complete line the span of every command it runs (doc 21 revision 3,
 * section 35). The fixture's files must match the manifest's hashes, so an expectation cannot change unnoticed.
 */
final class ShellCorpusTest extends TestCase
{
    use RefreshHookDatabase;

    private const string CORPUS = __DIR__.'/../../Fixtures/Processes/ShellCorpus';

    private const int SHOWN_DIFFERENCES = 40;

    public function test_the_fixture_matches_its_manifest(): void
    {
        $manifest = $this->manifest();

        $this->assertSame(1, $manifest['schema_version']);
        foreach ($manifest['fixtures'] as $name => $hash) {
            $this->assertSame(
                $hash,
                hash_file('sha256', self::CORPUS.'/'.$name),
                "{$name} does not match the manifest",
            );
        }
        $this->assertSame($manifest['counts']['cases'], count($this->cases()));
        $this->assertSame(
            $manifest['counts']['inputs'],
            array_sum(array_map(fn (array $case) => count($case['origins']), $this->cases())),
        );
    }

    public function test_every_case_reads_as_its_frozen_expectation(): void
    {
        $syntax = $this->app->make(ShellSyntax::class);
        $differences = [];

        foreach ($this->cases() as $case) {
            $expected = $case['expected'];
            $this->assertNotSame([], $expected, "{$case['id']} has no frozen expectation");
            $tree = $syntax->parse($case['source'], ShellDialect::from($case['dialect']));

            $actual = ['outcome' => $tree->outcome->value];
            if ($tree->outcome === ParseOutcome::Complete) {
                $actual['parts'] = array_map(
                    fn (ShellNode $node) => ['start' => $node->range->start, 'end' => $node->range->end],
                    $this->sortedParts($tree->executableParts()),
                );
            }
            $wanted = ['outcome' => $expected['outcome']];
            if ($expected['outcome'] === 'complete') {
                $wanted['parts'] = $this->sortedSpans($expected['parts']);
            }

            if ($actual !== $wanted) {
                $differences[] = $case['id'].' '.json_encode(
                    $case['source'],
                ).' expected '.json_encode($wanted).' read '.json_encode($actual);
            }
        }

        $this->assertSame(
            [],
            array_slice($differences, 0, self::SHOWN_DIFFERENCES),
            count($differences).' cases differ from their frozen expectation',
        );
    }

    #[TimeLimit(15, 'It classifies all 1,591 complete corpus cases with the real classifier.')]
    public function test_every_complete_case_classifies_as_its_frozen_expectation(): void
    {
        $this->app->instance(AliasResolver::class, new NoAliases());
        $syntax = $this->app->make(ShellSyntax::class);
        $classifier = $this->app->make(CommandClassifier::class);
        $context = new ExecutionContext(ShellDialect::Bash, '/work', '/work');
        $differences = [];

        foreach ($this->cases() as $case) {
            if ($case['expected']['outcome'] !== 'complete') {
                continue;
            }
            $actual = $classifier->classify(
                $syntax->parse($case['source'], ShellDialect::from($case['dialect'])),
                $context,
            )->summary()->toArray();

            if ($actual !== $case['expected']['classification']) {
                $differences[] = $case['id'].' expected '.json_encode(
                    $case['expected']['classification'],
                ).' classified '.json_encode($actual);
            }
        }

        $this->assertSame(
            [],
            array_slice($differences, 0, self::SHOWN_DIFFERENCES),
            count($differences).' cases classify differently from their frozen expectation',
        );
    }

    /**
     * @param  list<ShellNode>  $parts
     * @return list<ShellNode>
     */
    private function sortedParts(array $parts): array
    {
        usort(
            $parts,
            fn (ShellNode $first, ShellNode $second) => [$first->range->start, $first->range->end] <=> [
                $second->range->start,
                $second->range->end,
            ],
        );

        return $parts;
    }

    /**
     * @param  list<array{start: int, end: int}>  $spans
     * @return list<array{start: int, end: int}>
     */
    private function sortedSpans(array $spans): array
    {
        usort(
            $spans,
            fn (array $first, array $second) => [$first['start'], $first['end']] <=> [$second['start'], $second['end']],
        );

        return array_map(fn (array $span) => ['start' => $span['start'], 'end' => $span['end']], $spans);
    }

    /**
     * @return array<string, mixed>
     */
    private function manifest(): array
    {
        return json_decode((string) file_get_contents(self::CORPUS.'/manifest.json'), true, 512, JSON_THROW_ON_ERROR);
    }

    /**
     * @return list<array{id: string, source: string, dialect: string, origins: list<array<string, mixed>>, expected:
     *   array<string, mixed>}>
     */
    private function cases(): array
    {
        return array_map(
            fn (string $line) => json_decode($line, true, 512, JSON_THROW_ON_ERROR),
            file(self::CORPUS.'/cases.jsonl', FILE_IGNORE_NEW_LINES) ?: [],
        );
    }
}
