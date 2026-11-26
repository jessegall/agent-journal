<?php

declare(strict_types=1);

namespace Domain\Sharing\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * Too many public reads in a minute: of one share, or of links that lead nowhere.
 */
final class ShareReadLimited extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forShare(): self
    {
        return new self('This share is being read too often; try again in a minute.');
    }

    public static function forInvalidLinks(): self
    {
        return new self('Too many links that lead nowhere; try again in a minute.');
    }

    protected function status(): int
    {
        return 429;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Busy;
    }
}
