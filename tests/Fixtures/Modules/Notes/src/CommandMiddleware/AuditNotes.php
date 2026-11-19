<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\CommandMiddleware;

use Tests\Fixtures\Modules\Notes\Support\AuditCommands;

/**
 * Writes an audit row for each command of Notes inside its transaction.
 */
final readonly class AuditNotes extends AuditCommands
{
    protected function trailLine(): string
    {
        return 'notes inside';
    }
}
