<?php

declare(strict_types=1);

namespace App\Enums\Connections;

/**
 * Who took an audited step: the owner, or the host of a connected machine.
 */
enum ConnectionAuditActor: string
{
    case User = 'user';
    case Host = 'host';
}
