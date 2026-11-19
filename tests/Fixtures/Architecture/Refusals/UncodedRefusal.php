<?php

declare(strict_types=1);

namespace Tests\Fixtures\Architecture\Refusals;

use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Bus\Enums\RefusalCode;
use RuntimeException;

/**
 * Renders a refusal without declaring itself a coded one; the coded refusal test must find it.
 */
final class UncodedRefusal extends RuntimeException
{
    use RendersRefusal;

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }

    protected function status(): int
    {
        return 409;
    }
}
