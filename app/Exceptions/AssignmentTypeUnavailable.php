<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;

final class AssignmentTypeUnavailable extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forType(string $type): self
    {
        return new self("Records of type {$type} cannot be assigned here.");
    }

    public static function forAutoAssignment(string $type): self
    {
        return new self("Records of type {$type} cannot be assigned automatically here.");
    }

    public static function forPool(string $key): self
    {
        return new self("No pool {$key} exists here.");
    }

    public static function forActorType(string $type): self
    {
        return new self("An actor of type {$type} cannot hold records here.");
    }

    protected function status(): int
    {
        return 404;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }
}
