<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Processes\Contracts\AliasResolver;
use App\Processes\Contracts\CommandClassifier;
use App\Processes\Enums\ParseOutcome;
use App\Processes\Enums\ShellDialect;
use App\Processes\Syntax\TreeParser;
use App\Processes\Values\ExecutionContext;
use App\Processes\Values\ShellNode;
use Tests\Fixtures\Processes\NoAliases;
use Tests\Support\Processes\ShellCorpusCase;
use Tests\Support\Processes\ShellCorpusManifest;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Every case of the portable shell corpus goes through the container's TreeParser and must read as its frozen
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

        $this->assertSame(1, $manifest->schemaVersion);
        foreach ($manifest->fixtures as $name => $hash) {
            $this->assertSame(
                $hash,
                hash_file('sha256', self::CORPUS.'/'.$name),
                "{$name} does not match the manifest",
            );
        }
        $cases = $this->cases();
        $this->assertSame($manifest->counts->cases, count($cases));
        $this->assertSame(
            $manifest->counts->inputs,
            array_sum(array_map(fn (ShellCorpusCase $case) => count($case->origins), $cases)),
        );
    }

    public function test_every_case_reads_as_its_frozen_expectation(): void
    {
        $syntax = $this->app->make(TreeParser::class);
        $differences = [];

        foreach ($this->cases() as $case) {
            $expected = $case->expected;
            $tree = $syntax->parse($case->source, $case->dialect);

            $actual = ['outcome' => $tree->outcome->value];
            if ($tree->outcome === ParseOutcome::Complete) {
                $actual['parts'] = array_map(
                    fn (ShellNode $node) => ['start' => $node->range->start, 'end' => $node->range->end],
                    $this->sortedParts($tree->executableParts()),
                );
            }
            $wanted = ['outcome' => $expected->outcome];
            if ($expected->isComplete()) {
                $wanted['parts'] = $expected->sortedParts();
            }

            if ($actual !== $wanted) {
                $differences[] = $case->id.' '.json_encode(
                    $case->source,
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
        $syntax = $this->app->make(TreeParser::class);
        $classifier = $this->app->make(CommandClassifier::class);
        $context = new ExecutionContext(ShellDialect::Bash, '/work', '/work');
        $differences = [];

        foreach ($this->cases() as $case) {
            if (! $case->expected->isComplete()) {
                continue;
            }
            $actual = $classifier->classify(
                $syntax->parse($case->source, $case->dialect),
                $context,
            )->summary()->toArray();

            if ($actual !== $case->expected->classification) {
                $differences[] = $case->id.' expected '.json_encode(
                    $case->expected->classification,
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

    private function manifest(): ShellCorpusManifest
    {
        return ShellCorpusManifest::from((string) file_get_contents(self::CORPUS.'/manifest.json'));
    }

    /**
     * @return list<ShellCorpusCase>
     */
    private function cases(): array
    {
        return array_map(
            fn (string $line) => ShellCorpusCase::from($line),
            file(self::CORPUS.'/cases.jsonl', FILE_IGNORE_NEW_LINES) ?: [],
        );
    }
}
