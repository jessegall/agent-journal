<?php

declare(strict_types=1);

namespace App\Contracts\Messages;

use App\Contracts\Actors\Actor;

/**
 * An actor that sends messages: an agent or a user. The journal itself sends none.
 */
interface MessageSender extends Actor, MessageParticipant {}
