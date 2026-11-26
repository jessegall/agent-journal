<?php

declare(strict_types=1);

namespace App\Accounts\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
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

        return new self("A name is 1 to 80 characters, with no slash or control character; \"{$shown}\" is not.");
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
