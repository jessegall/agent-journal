<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;
use Throwable;

/**
 * A recovery that returns nothing: an unknown nonce, another host's nonce, a revoked host or a call that is not
 * signed rightly all answer alike, so the answer never tells which.
 */
final class BindingUnrecoverable extends RuntimeException implements CodedRefusal
{
    use RendersRefusal;

    public static function generic(Throwable|null $cause = null): self
    {
        return new self('This connection cannot be recovered.', previous: $cause);
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }

    protected function status(): int
    {
        return 404;
    }
}
