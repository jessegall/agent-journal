<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Exceptions;

use RuntimeException;

/**
 * The Notes fixture module's own failure, thrown after nested work so a test sees that work roll back with it.
 */
final class NoteWorkFailed extends RuntimeException
{
    public static function afterNestedWork(): self
    {
        return new self('The surrounding note work failed after its nested command ran.');
    }

    public static function afterItsAudit(): self
    {
        return new self('The note work failed after it dispatched its audit.');
    }

    public static function whileListening(): self
    {
        return new self('The note state refused to finish collecting the event.');
    }
}
