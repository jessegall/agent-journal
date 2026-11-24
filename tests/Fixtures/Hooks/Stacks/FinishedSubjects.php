<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Stacks;

/**
 * The subjects a stack test has finished, which every finishable state of the test asks; a test adds to it in place.
 */
final class FinishedSubjects
{
    /**
     * @var list<string>
     */
    public array $finished = [];

    public function has(string $subject): bool
    {
        return in_array($subject, $this->finished, true);
    }
}
