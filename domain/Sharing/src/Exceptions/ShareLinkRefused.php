<?php

declare(strict_types=1);

namespace Domain\Sharing\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;

/**
 * A public share link that leads nowhere: malformed or unknown, told apart only in the code, never in the words, and
 * never with the link itself.
 */
final class ShareLinkRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    private const string NEUTRAL = 'This share link is not available.';

    public static function malformed(): self
    {
        return new self(self::NEUTRAL);
    }

    public static function unknown(): self
    {
        return new self(self::NEUTRAL);
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
