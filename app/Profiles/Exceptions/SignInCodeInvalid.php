<?php

declare(strict_types=1);

namespace App\Profiles\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * A sign-in code, key or token that is empty, too long, holds a control character or a space, so it never reaches the
 * driver and the sign-in keeps waiting for another; the message never shows the value.
 */
final class SignInCodeInvalid extends InvalidArgumentException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function make(string $what, int $limit): self
    {
        return new self("A {$what} is 1 to {$limit} printable characters on one line.");
    }

    public static function withSpace(string $what): self
    {
        return new self("This is not a {$what}: it has spaces. Paste the {$what} again.");
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
