<?php

declare(strict_types=1);

namespace App\Contracts\Questions;

use App\Contracts\Actors\Actor;

/**
 * An actor that can be asked a question; a question to any other actor is refused.
 */
interface AnswersQuestions extends Actor {}
