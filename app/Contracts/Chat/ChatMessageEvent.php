<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Contracts\Events\Event;

/**
 * An event about one message of a chat: offered to a member to answer, or accepted into the chat.
 */
interface ChatMessageEvent extends Event {}
