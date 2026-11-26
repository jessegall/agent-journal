<?php

declare(strict_types=1);

namespace App\Search\Exceptions;

use LogicException;

/**
 * A provider answered with a batch that breaks the batch rules: too many hits, hits out of order or repeated, hits on
 * an outcome that carries none, or refreshed matches nobody asked for.
 */
final class SearchBatchInvalid extends LogicException
{
    public static function tooManyHits(int $limit): self
    {
        return new self("A search batch holds at most {$limit} hits.");
    }

    public static function outOfOrder(): self
    {
        return new self('A search batch lists its hits by score from the highest, then by identity.');
    }

    public static function repeated(string $identity): self
    {
        return new self("A search batch lists the hit {$identity} twice.");
    }

    public static function hitsOnEmptyOutcome(string $outcome): self
    {
        return new self("A {$outcome} search batch carries no hits.");
    }

    public static function moreWithoutHits(): self
    {
        return new self('A batch that promises more hits after these certifies at least one hit.');
    }

    public static function notRequested(string $identity): self
    {
        return new self("A refreshed batch answered {$identity}, which was not asked for.");
    }

    public static function tooManyCandidates(int $limit): self
    {
        return new self("A refresh asks about at most {$limit} candidates.");
    }
}
