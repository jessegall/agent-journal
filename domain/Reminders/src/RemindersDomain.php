<?php

declare(strict_types=1);

namespace Domain\Reminders;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Skills\Contracts\ProvidesSkills;
use Domain\Reminders\Skills\RemindersSkill;

final class RemindersDomain extends Domain implements ProvidesSkills
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

    public function exports(): Exports
    {
        return Exports::make()
            ->build();
    }

    public function skills(): array
    {
        return [RemindersSkill::class];
    }
}
