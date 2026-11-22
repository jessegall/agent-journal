<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Contracts\Actors\Actor;

/**
 * An actor that may receive direct messages.
 */
interface MessageRecipient extends Actor {}
