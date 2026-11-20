<?php

declare(strict_types=1);

namespace App\Supervision\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Contracts\CommandRefusal;
use App\Supervision\Values\SubjectType;
use RuntimeException;

final class AskRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function typeRepeated(string $type): self
    {
        return new self("The ask type {$type} is registered twice.");
    }

    public static function workRequired(SubjectType $type): self
    {
        return new self("The {$type->key} ask needs a visible work record.");
    }

    public static function submissionChanged(): self
    {
        return new self('The key belongs to another ask submission.');
    }

    public static function routeChanged(): self
    {
        return new self('The ask has moved since this route was read.');
    }

    public static function wrongOperation(): self
    {
        return new self('The operation does not answer this ask type.');
    }

    public static function operationDenied(string $reason): self
    {
        return new self($reason);
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Forbidden;
    }
}
