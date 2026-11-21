<?php

declare(strict_types=1);

namespace App\Connections\Enums;

/**
 * Who took an audited step: the owner, or the host of a connected machine.
 */
enum ConnectionAuditActor: string
{
    case User = 'user';
    case Host = 'host';
}
