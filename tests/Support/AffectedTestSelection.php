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
     * The taken test files, relative to the project root and in rank order, each with its class and taken methods.
     *
     * @param  array<string, array{class: string, methods: list<string>}>  $testsByFile
     */
    public function __construct(
        public array $testsByFile,
        public int $leftOut,
        public int $reach,
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
     * @return list<string>
     */
    public function testFiles(): array
    {
        return array_keys($this->testsByFile);
    }

    /**
     * The files the run takes: the nearest tests.
     *
     * @return list<string>
     */
    public function runFiles(): array
    {
        return $this->testFiles();
    }

    /**
     * A PHPUnit filter that runs exactly the taken methods, each as Class::method with any of its data sets.
     */
    public function filter(): string
    {
        $names = [];

        foreach ($this->testsByFile as $test) {
            foreach ($test['methods'] as $method) {
                $names[] = preg_quote("{$test['class']}::{$method}", '/');
            }
        }

        return '/^(?:'.implode('|', $names).')(?: with data set .*)?$/';
    }
}
