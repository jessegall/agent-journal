<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Contracts\Events\Event;

/**
 * A fact about accounts, their sign-ins and their use: every event of that subject extends it, so a listener typed on
 * it hears them all.
 */
abstract readonly class AccountEvent implements Event {}
