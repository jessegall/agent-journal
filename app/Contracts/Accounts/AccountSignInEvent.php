<?php

declare(strict_types=1);

namespace App\Contracts\Accounts;

use App\Contracts\Events\Event;

/**
 * An account signed in or out.
 */
interface AccountSignInEvent extends Event {}
