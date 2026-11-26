<?php

declare(strict_types=1);

namespace App\Profiles\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * A sign-in receipt asked for names neither the driver of a new account nor the account of a renewal.
 */
final class SignInReceiptUnnamed extends RuntimeException implements CodedRefusal
{
    use RendersRefusal;

    public static function for(string $key): self
    {
        return new self("The sign-in receipt {$key} names neither a driver nor an account.");
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
