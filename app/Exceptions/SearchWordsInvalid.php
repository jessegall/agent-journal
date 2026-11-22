<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use InvalidArgumentException;

/**
 * Search words shorter or longer than a search accepts, refused before any source is asked.
 */
final class SearchWordsInvalid extends InvalidArgumentException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function tooShort(int $minimum): self
    {
        return new self("Type at least {$minimum} characters to search.");
    }

    public static function tooLong(int $limit): self
    {
        return new self("Search words hold at most {$limit} characters.");
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
