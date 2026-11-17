<?php

declare(strict_types=1);

namespace App\Domain\Access\Exceptions;

use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

final class JournalAccessDenied extends AccessDeniedHttpException
{
    public static function forPerson(): self
    {
        return new self('This account may not use the journal.');
    }
}
