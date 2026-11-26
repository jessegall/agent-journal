<?php

declare(strict_types=1);

namespace App\Asks\Contracts;

use App\Actors\Contracts\Actor;

/**
 * An actor that can be asked a question; a question to any other actor is refused.
 */
interface QuestionRecipient extends Actor {}
