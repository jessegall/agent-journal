<?php

declare(strict_types=1);

namespace App\Connections\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * This server issues no install lines now: connecting projects is switched off, the server origin is not https, or
 * no compatible release is published.
 */
final class InstallLinesUnavailable extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function now(): self
    {
        return new self(
            'This journal cannot issue install lines: switch on connecting projects, set an https server origin and '
            .'publish a release first.',
        );
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }

    protected function status(): int
    {
        return 409;
    }
}
