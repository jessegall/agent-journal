<?php

declare(strict_types=1);

namespace App\Reminders;

use App\Domains\Domain;

final class RemindersDomain implements Domain
{
    public function description(): string
    {
        return 'Something to do at a time or on an interval.';
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }
}
