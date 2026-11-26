<?php

declare(strict_types=1);

namespace App\Processes\Grammar;

use App\Processes\Grammar\Exceptions\NoSubstitutionFound;
use App\Processes\Grammar\Lines\ShellSource;

/**
 * The segments of a word still to search for substitutions, in reading order, and the substitution found last, which
 * is read next as a line of its own.
 */
final readonly class SubstitutionQueue
{
    /**
     * @param  list<PendingSegment>  $pending
     */
    private function __construct(public int $owner, public array $pending, public ShellSource|null $found) {}

    public static function of(UnparsedSubstitutions $toParse): self
    {
        return new self($toParse->owner, PendingSegment::allOf($toParse), null);
    }

    /**
     * @param  list<PendingSegment>  $pending  the segments after the one the substitution was found in
     */
    public function found(ShellSource $substitution, array $pending): self
    {
        return new self($this->owner, $pending, $substitution);
    }

    public function empty(): self
    {
        return new self($this->owner, [], null);
    }

    public function hasFound(): bool
    {
        return $this->found !== null;
    }

    public function foundSource(): ShellSource
    {
        return $this->found ?? throw NoSubstitutionFound::inQueue();
    }
}
