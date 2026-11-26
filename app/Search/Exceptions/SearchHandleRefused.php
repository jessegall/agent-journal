<?php

declare(strict_types=1);

namespace App\Search\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * A search handle that was not issued to this caller, or was changed: it reveals no words, hits or sources.
 */
final class SearchHandleRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function make(): self
    {
        return new self('This search continuation is not yours to use; start a fresh search.');
    }

    protected function status(): int
    {
        return 403;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Forbidden;
    }
}
