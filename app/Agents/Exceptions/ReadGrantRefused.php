<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
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
