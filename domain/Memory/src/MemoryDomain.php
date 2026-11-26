<?php

declare(strict_types=1);

namespace Domain\Memory;

use App\Contracts\Authorization\PolicyProvider;
use App\Contracts\Bus\CommandProvider;
use App\Contracts\Skills\SkillProvider;
use App\Enums\Agents\AccessType;
use App\Mcp\Contracts\McpToolProvider;
use App\Support\Domain;
use App\Support\Exports;
use App\Support\Searchable;
use App\Values\PolicyDefinition;
use Domain\Memory\Commands\EditMemory\EditMemoryCommand;
use Domain\Memory\Commands\RemoveMemory\RemoveMemoryCommand;
use Domain\Memory\Commands\SaveMemory\SaveMemoryCommand;
use Domain\Memory\Contracts\MemoryResolver;
use Domain\Memory\Exceptions\MemoryRevisionChanged;
use Domain\Memory\Mcp\Resources\MemoryResource;
use Domain\Memory\Policies\MemoryPolicy;
use Domain\Memory\Support\MemorySearchAccess;
use Domain\Memory\Support\MemorySearchProvider;
use Domain\Memory\Support\Skills\MemorySkill;
use Domain\Memory\Values\MemoryCard;
use Domain\Memory\Values\MemoryPage;

final class MemoryDomain extends Domain implements
    CommandProvider,
    McpToolProvider,
    PolicyProvider,
    SkillProvider
{
    public function description(): string
    {
        return 'The weighted memories each agent keeps past its context window.';
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
            ->contracts(MemoryResolver::class)
            ->values(MemoryPage::class, MemoryCard::class)
            ->exceptions(MemoryRevisionChanged::class)
            ->build();
    }

    public function policies(): array
    {
        return [
            new PolicyDefinition(
                MemoryPolicy::class,
                [AccessType::Read, AccessType::Create, AccessType::Edit],
            ),
        ];
    }

    public function commands(): array
    {
        return [
            SaveMemoryCommand::class,
            EditMemoryCommand::class,
            RemoveMemoryCommand::class,
        ];
    }

    public function searchables(): array
    {
        return [Searchable::make('memory', 'Memories', MemorySearchAccess::class, MemorySearchProvider::class)];
    }

    public function skills(): array
    {
        return [MemorySkill::class];
    }

    public function mcpResources(): array
    {
        return [MemoryResource::class];
    }

    public function overviewContributions(): array
    {
        return [];
    }
}
