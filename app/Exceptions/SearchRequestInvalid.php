<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use InvalidArgumentException;

/**
 * Search arguments that do not form one request, refused before any source is asked. The message names the
 * arguments, never the words the caller typed.
 */
final class SearchRequestInvalid extends InvalidArgumentException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function conflicting(string $first, string $second): self
    {
        return new self("Send {$first} or {$second}, not both; a continuation you hold stays usable.");
    }

    public static function withoutWords(): self
    {
        return new self('Send query with the words to search, discover to list sources, or a continuation.');
    }

    public static function limitOutOfRange(int $minimum, int $maximum): self
    {
        return new self("The limit is a whole number from {$minimum} to {$maximum}.");
    }

    public static function blankScope(): self
    {
        return new self('Within names a source by its key or label, such as tasks.task or Tasks.');
    }

    protected function status(): int
    {
        return 422;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
