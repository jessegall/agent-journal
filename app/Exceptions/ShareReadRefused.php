<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;
use Throwable;

/**
 * A public read named a path or a page position the share does not allow: too deep, circular, not made of declared
 * relations, or a page position from another share, record or scope. A visitor starts again from the shared link.
 */
final class ShareReadRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function malformedPath(Throwable|null $previous = null): self
    {
        return new self('This address is not part of the share; start again from the shared link.', previous: $previous);
    }

    public static function tooDeep(int $most): self
    {
        return new self(
            "A share can be followed at most {$most} steps from the shared record; start again from the shared link.",
        );
    }

    public static function circular(): self
    {
        return new self('This address goes round in a circle; start again from the shared link.');
    }

    public static function staleCursor(Throwable|null $previous = null): self
    {
        return new self('This page position belongs to an older view of the share; start again from the shared link.', previous: $previous);
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
