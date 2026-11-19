<?php

declare(strict_types=1);

namespace App\Profiles\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * An account name that is empty, longer than 80 characters, or holds a control character or a path separator.
 */
final class AccountLabelInvalid extends InvalidArgumentException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(string $text): self
    {
        $shown = mb_substr($text, 0, 80);

        return new self("An account name is 1 to 80 characters with no control character or slash; \"{$shown}\" is not.");
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
