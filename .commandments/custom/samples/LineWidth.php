<?php

declare(strict_types=1);

namespace App\Samples;

/**
 * A line of code past 120 characters the line-width rule must find, and the one-line message and the console signature
 * it must pass.
 */
final class LineWidth
{
    // @righteous LineWidthDetector
    protected $signature = 'samples:wide {first : The first argument of the command} {--second= : The second option it takes}';

    public function message(): string
    {
        // @righteous LineWidthDetector
        return sprintf('A message the program shows is one source line, however long it reads: %s and so on.', 'it');
    }

    public function sum(int $first, int $second, int $third, int $fourth, int $fifth): int
    {
        return $this->add($first, $second) + $this->add($third, $fourth) + $this->add($fifth, $first) + $this->add($second, $third); // @sin LineWidthDetector
    }

    private function add(int $left, int $right): int
    {
        return $left + $right;
    }
}
