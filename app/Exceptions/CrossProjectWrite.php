<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;

/**
 * A command would write a record outside the project its sender works in.
 */
final class CrossProjectWrite extends RuntimeException implements CodedRefusal
{
    use RendersRefusal;

    public static function forOwner(): self
    {
        return new self('An agent can only add things to its own project');
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Forbidden;
    }

    protected function status(): int
    {
        return 403;
    }
}
