<?php

declare(strict_types=1);

namespace Domain\Reminders;

use App\Access\Contracts\PolicyProvider;
use App\Access\Values\PolicyDefinition;
use App\Agents\Enums\AccessType;
use App\Declarations\Page;
use App\Mcp\Contracts\McpToolProvider;
use App\Navigation\Contracts\PageProvider;
use App\Navigation\Enums\Icon;
use App\Skills\Contracts\SkillProvider;
use App\Support\Domain;
use App\Support\Exports;
use Domain\Reminders\Http\Pages\Resolvers\RemindersWindowResolver;
use Domain\Reminders\Policies\ReminderPolicy;
use Domain\Reminders\Support\Skills\RemindersSkill;

final class RemindersDomain extends Domain implements
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
