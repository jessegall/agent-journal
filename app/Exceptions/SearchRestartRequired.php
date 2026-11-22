<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * A search position of this caller that is gone: expired, evicted or from an older search contract. The caller
 * starts a fresh search with its own words.
 */
final class SearchRestartRequired extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function expired(): self
    {
        return new self('This search expired or was set aside; search again with fresh words.');
    }

    public static function obsolete(): self
    {
        return new self('This continuation belongs to an earlier search; search again with fresh words.');
    }

    protected function status(): int
    {
        return 410;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StaleContinuation;
    }
}
