<?php

declare(strict_types=1);

namespace App\Messages\Contracts;

use App\Actors\Contracts\Actor;

/**
 * An agent or user who sends messages as an inbox participant.
 */
interface MessageSender extends Actor, MessageParticipant {}
