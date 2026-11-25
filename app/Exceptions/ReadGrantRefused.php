<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;

final class ReadGrantRefused extends RuntimeException implements CodedRefusal
{
    public static function because(string $reason): self
    {
        return new self($reason);
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Forbidden;
    }
}
