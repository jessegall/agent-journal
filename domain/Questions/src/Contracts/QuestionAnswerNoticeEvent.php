<?php

declare(strict_types=1);

namespace Domain\Questions\Contracts;

use App\Contracts\Events\Event;

/**
 * A change to a question's answer notice: every event of it implements this, so a listener typed on it hears them all.
 */
interface QuestionAnswerNoticeEvent extends Event {}
