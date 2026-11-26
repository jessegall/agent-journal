<?php

declare(strict_types=1);

namespace App\Projects\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

/**
 * A host's answer to a read of its project was refused: the read is another host's, already settled, or the answer
 * breaks a bound the journal checks again.
 */
final class ProjectReadRefused extends RuntimeException implements CommandRefusal
{
    /**
     * @use ThrowsLater<ProjectReadRefused>
     */
    use ThrowsLater;

    public static function missing(string $readId): self
    {
        return new self("Project read {$readId} does not exist.");
    }

    public static function pathTooLong(int $limit): self
    {
        return new self("A project read names a path longer than {$limit} characters.");
    }

    public static function tooManyPaths(int $limit): self
    {
        return new self("A project read asks for more than {$limit} paths at once.");
    }

    public static function notAsked(string $path): self
    {
        return new self("The project read did not ask for {$path}.");
    }

    public static function ofAnotherActor(string $readId): self
    {
        return new self("Project read {$readId} belongs to another host's project.");
    }

    public static function settled(string $readId): self
    {
        return new self("Project read {$readId} was answered already.");
    }

    public static function withoutAnswer(string $readId): self
    {
        return new self("The answer to project read {$readId} holds neither entries, text nor a failure.");
    }

    public static function tooManyEntries(string $readId, int $limit): self
    {
        return new self("The answer to project read {$readId} lists more than {$limit} entries.");
    }

    public static function entryName(string $readId): self
    {
        return new self("The answer to project read {$readId} names an entry that is empty or holds a slash or NUL.");
    }

    public static function textTooLong(string $readId, int $limit): self
    {
        return new self("The text in the answer to project read {$readId} is longer than {$limit} bytes.");
    }

    public static function textNotUtf8(string $readId): self
    {
        return new self("The text in the answer to project read {$readId} is not valid UTF-8.");
    }

    public static function digest(string $readId): self
    {
        return new self("The digest in the answer to project read {$readId} is not 64 hexadecimal characters.");
    }
}
