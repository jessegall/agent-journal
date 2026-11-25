<?php

declare(strict_types=1);

namespace App\Mcp\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;

/**
 * A continuation the journal did not issue for this call: unreadable, changed, from another session or for another
 * read.
 */
final class ContinuationInvalid extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function unreadable(): self
    {
        return new self('The continuation is not one the journal issued; start the read again without it.');
    }

    public static function changed(): self
    {
        return new self('The continuation was changed after the journal issued it; start the read again without it.');
    }

    public static function foreign(): self
    {
        return new self('The continuation belongs to another session; start the read again without it.');
    }

    public static function otherRead(string $tool, string $selector): self
    {
        return new self(
            "The continuation was not issued for {$tool} of {$selector}; send it to the read that returned it.",
        );
    }

    public static function withFilters(string $filter): self
    {
        return new self("A continuation carries its own filters; send it without {$filter}.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
