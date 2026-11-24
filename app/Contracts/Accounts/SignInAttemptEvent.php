<?php

declare(strict_types=1);

namespace App\Contracts\Accounts;

use App\Contracts\Events\Event;

/**
 * A step of a sign-in attempt: started, finished, released or its cleanup retried.
 */
interface SignInAttemptEvent extends Event {}
