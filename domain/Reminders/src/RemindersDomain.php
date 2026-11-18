<?php

declare(strict_types=1);

namespace Domain\Reminders;

use App\Domains\Support\Domain;

final class RemindersDomain extends Domain
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

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [];
    }
}
