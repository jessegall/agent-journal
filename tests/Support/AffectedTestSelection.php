<?php

declare(strict_types=1);

namespace Tests\Support;

/**
 * The test files a change reaches, how many test methods they hold together, and how many steps out from the changed
 * classes the reach went; a selection over the most test methods an affected run takes is refused.
 */
final readonly class AffectedTestSelection
{
    /**
     * @param  array<string, int>  $testMethodsByFile  the test files, relative to the project root, with their methods
     */
    public function __construct(
        public array $testMethodsByFile,
        public int $reach,
    ) {}

    public function methodCount(): int
    {
        return array_sum($this->testMethodsByFile);
    }

    public function isRefused(): bool
    {
        return $this->methodCount() > AffectedTests::MOST_TEST_METHODS;
    }

    /**
     * @return list<string>
     */
    public function testFiles(): array
    {
        return array_keys($this->testMethodsByFile);
    }
}
