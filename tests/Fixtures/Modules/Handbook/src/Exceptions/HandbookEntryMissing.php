<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Handbook\Exceptions;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * No entry with that number belongs to the reader; a missing and a hidden entry answer alike.
 */
final class HandbookEntryMissing extends NotFoundHttpException
{
    public static function forNumber(string $number): self
    {
        return new self("No handbook entry {$number} is yours to read.");
    }
}
