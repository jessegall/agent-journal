<?php

declare(strict_types=1);

namespace App\Messages\Contracts;

use App\Actors\Contracts\Actor;

/**
 * An actor that sends messages: an agent or a user. The journal itself sends none.
 */
interface MessageSender extends Actor, MessageParticipant {}
