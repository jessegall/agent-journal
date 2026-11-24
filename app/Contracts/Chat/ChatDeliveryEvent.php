<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Contracts\Events\Event;

/**
 * A change to how a chat message reaches its readers: a receipt shown, deliveries planned or changed.
 */
interface ChatDeliveryEvent extends Event {}
