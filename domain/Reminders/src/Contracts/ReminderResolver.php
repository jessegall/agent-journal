<?php

declare(strict_types=1);

namespace Domain\Reminders\Contracts;

use App\Exceptions\ActorNotAllowed;
use Domain\Reminders\Values\ReminderPage;

/**
 * Reads the calling actor's own reminders, 25 to a page, open ones first by due time; nobody reads another actor's.
 */
interface ReminderResolver
{
    public const int PER_PAGE = 25;

    /**
     * @throws ActorNotAllowed
     */
    public function own(int $page): ReminderPage;
}
