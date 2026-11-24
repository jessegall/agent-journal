<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Contracts\Events\Event;

/**
 * A change to who belongs to a chat or the role they hold in it.
 */
interface ChatMembershipEvent extends Event {}
