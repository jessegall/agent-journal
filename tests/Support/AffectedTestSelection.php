<?php

declare(strict_types=1);

namespace Tests\Support;

/**
 * The test methods an affected run takes, nearest to the change first, how many reached methods it left out, and
 * how many steps out from the changed classes the reach went.
 *
 * @phpstan-type RankedTest array{file: string, class: string, methods: list<string>, step: int, connections: int}
 */
final readonly class AffectedTestSelection
{
    /**
     * The taken test files, relative to the project root and in rank order, each with its class and taken methods, and
     * the test files every run takes whole, by their class.
     *
     * @param  array<string, array{class: string, methods: list<string>}>  $testsByFile
     * @param  array<string, string>  $wholeTests
     */
    public function __construct(
        public array $testsByFile,
        public int $leftOut,
        public int $reach,
        public array $wholeTests = [],
    ) {}

    /**
     * The first test methods of the ranked tests, up to the most given; a file only part of which fits gives its
     * first methods, and every method past the most counts as left out.
     *
     * @param  list<RankedTest>  $ranked
     */
    public static function nearestOf(array $ranked, int $most, int $reach): self
    {
        $taken = [];
        $room = $most;
        $leftOut = 0;

        foreach ($ranked as $test) {
            $methods = array_slice($test['methods'], 0, max(0, $room));
            $leftOut += count($test['methods']) - count($methods);
            $room -= count($methods);

            if ($methods !== []) {
                $taken[$test['file']] = ['class' => $test['class'], 'methods' => $methods];
            }
        }

        return new self($taken, $leftOut, $reach);
    }

    public function methodCount(): int
    {
        return array_sum(array_map(fn (array $test) => count($test['methods']), $this->testsByFile));
    }

    /**
     * The selection that also takes these test files whole, outside the count of its nearest tests.
     *
     * @param  array<string, string>  $classesByFile
     */
    public function withEveryTestOf(array $classesByFile): self
    {
        return new self($this->testsByFile, $this->leftOut, $this->reach, $classesByFile);
    }

    /**
     * @return list<string>
     */
    public function testFiles(): array
    {
        return array_keys($this->testsByFile);
    }

    /**
     * The files the run takes: the nearest tests, then the tests taken whole.
     *
     * @return list<string>
     */
    public function runFiles(): array
    {
        return array_values(array_unique([...$this->testFiles(), ...array_keys($this->wholeTests)]));
    }

    /**
     * A PHPUnit filter that runs exactly the taken methods, each as Class::method with any of its data sets, and every
     * method of the tests taken whole.
     */
    public function filter(): string
    {
        $names = [];

        foreach ($this->testsByFile as $test) {
            foreach ($test['methods'] as $method) {
                $names[] = preg_quote("{$test['class']}::{$method}", '/');
            }
        }

        foreach ($this->wholeTests as $class) {
            $names[] = preg_quote($class, '/').'::\\w+';
        }

        return '/^(?:'.implode('|', $names).')(?: with data set .*)?$/';
    }
}
