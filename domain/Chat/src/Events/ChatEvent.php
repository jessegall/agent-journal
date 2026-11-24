<?php

declare(strict_types=1);

namespace Domain\Chat\Events;

use App\Contracts\Events\Event;

/**
 * A fact about chats: their docks and reactions: every event of that subject extends it, so a listener typed on it hears them all.
 */
abstract readonly class ChatEvent implements Event {}
