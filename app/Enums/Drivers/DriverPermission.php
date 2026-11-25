<?php

declare(strict_types=1);

namespace App\Enums\Drivers;

/**
 * The native permission decisions the journal sends for a tool call: allow for a call its own admission passed, so
 * the driver asks no user, and deny with a reason. The driver's own deny rules still refuse a call the journal
 * allowed, which is how a saved account's sign-in stays closed.
 */
enum DriverPermission: string
{
    case Allow = 'allow';
    case Deny = 'deny';
}
