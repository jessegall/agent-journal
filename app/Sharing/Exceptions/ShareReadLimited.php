<?php

declare(strict_types=1);

namespace App\Sharing\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
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
