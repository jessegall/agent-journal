<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;

final class UploadInvalid extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function forDeclaration(): self
    {
        return new self('An upload must declare between 1 byte and 2 MiB and its SHA-256 digest.');
    }

    public static function forChunk(): self
    {
        return new self('The chunk must have the next index, valid UTF-8 text, and its matching SHA-256 digest.');
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
