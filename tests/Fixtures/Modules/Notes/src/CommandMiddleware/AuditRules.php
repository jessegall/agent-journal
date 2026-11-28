<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\CommandMiddleware;

use Tests\Fixtures\Modules\Notes\Support\AuditCommands;

/**
 * Writes an audit row for each command of Rules inside its transaction: a module watching another owner's commands.
 */
final readonly class AuditRules extends AuditCommands
{
    protected function stepLine(): string
    {
        return 'notes audits rules';
    }
}
