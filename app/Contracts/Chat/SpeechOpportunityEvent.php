<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Contracts\Events\Event;

/**
 * A change of a speech opportunity: reserved, claimed, released or settled.
 */
interface SpeechOpportunityEvent extends Event {}
