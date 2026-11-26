<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * A browser asked for a project it may not choose or that does not exist; both get the same answer.
 */
final class ProjectUnavailable extends RuntimeException implements CodedRefusal
{
    use RendersRefusal;

    public static function forChoice(): self
    {
        return new self('This project is not available');
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
