<?php

declare(strict_types=1);

namespace Domain\Memory;

use App\Access\Contracts\PolicyProvider;
use App\Access\Values\PolicyDefinition;
use App\Agents\Enums\AccessType;
use App\Mcp\Contracts\McpToolProvider;
use App\Skills\Contracts\SkillProvider;
use App\Support\Domain;
use App\Support\Exports;
use App\Support\SearchSource;
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

    public function searchables(): array
    {
        return [SearchSource::make('memory', 'Memories', MemorySearchAccess::class, MemorySearchProvider::class)];
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
