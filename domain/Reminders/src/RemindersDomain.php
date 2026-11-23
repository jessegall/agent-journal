<?php

declare(strict_types=1);

namespace Domain\Reminders;

use App\Contracts\Authorization\PolicyProvider;
use App\Contracts\Bus\CommandProvider;
use App\Contracts\Navigation\PageProvider;
use App\Contracts\Skills\SkillProvider;
use App\Declarations\Page;
use App\Enums\AccessType;
use App\Enums\Icon;
use App\Mcp\Contracts\McpToolProvider;
use App\Support\Domain;
use App\Support\Exports;
use App\Values\PolicyDefinition;
use Domain\Reminders\Commands\CreateReminder\CreateReminderCommand;
use Domain\Reminders\Commands\FinishReminder\FinishReminderCommand;
use Domain\Reminders\Policies\ReminderPolicy;
use Domain\Reminders\Resolvers\RemindersWindowResolver;
use Domain\Reminders\Support\Skills\RemindersSkill;

final class RemindersDomain extends Domain implements
    CommandProvider,
    McpToolProvider,
    PageProvider,
    PolicyProvider,
    SkillProvider
{
    public function description(): string
    {
        return 'Something to do at a time.';
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

    public function policies(): array
    {
        return [
            new PolicyDefinition(
                ReminderPolicy::class,
                [AccessType::Read, AccessType::Create, AccessType::Edit],
            ),
        ];
    }

    public function commands(): array
    {
        return [CreateReminderCommand::class, FinishReminderCommand::class];
    }

    public function skills(): array
    {
        return [RemindersSkill::class];
    }

    public function mcpResources(): array
    {
        return [];
    }

    public function overviewContributions(): array
    {
        return [];
    }
}
