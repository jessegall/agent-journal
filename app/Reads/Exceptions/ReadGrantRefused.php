<?php

declare(strict_types=1);

namespace App\Reads\Exceptions;

use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
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
