<?php

declare(strict_types=1);

namespace App\Contracts\Accounts;

use App\Contracts\Events\Event;

/**
 * A step of a removed account's folder cleanup: released to a host or tried again.
 */
interface AccountCleanupEvent extends Event {}
