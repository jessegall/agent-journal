<?php

declare(strict_types=1);

namespace Domain\Reminders;

use App\Contracts\PageProvider;
use App\Contracts\SkillProvider;
use App\Declarations\Page;
use App\Enums\Icon;
use App\Support\Domain;
use App\Support\Exports;
use Domain\Reminders\Resolvers\RemindersWindowResolver;
use Domain\Reminders\Support\Skills\RemindersSkill;

final class RemindersDomain extends Domain implements PageProvider, SkillProvider
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

    /**
     * The reminders window, on Home and on its own page.
     */
    public function pages(): array
    {
        return [
            Page::layout('list', 'Reminders', Icon::Activity, RemindersWindowResolver::class)->at('')->onHome(30),
        ];
    }

    public function skills(): array
    {
        return [RemindersSkill::class];
    }
}
