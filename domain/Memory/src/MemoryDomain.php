<?php

declare(strict_types=1);

namespace Domain\Memory;

use App\Actors\Contracts\ProvidesPolicies;
use App\Actors\Values\PolicyRegistration;
use App\Bus\Contracts\ProvidesCommands;
use App\Domains\Concerns\HasNumberedModels;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Numbers\Contracts\ProvidesNumberedModels;
use App\Numbers\Support\NumberedModel;
use App\Skills\Contracts\ProvidesSkills;
use Domain\Memory\Api\MemoryCard;
use Domain\Memory\Api\MemoryPage;
use Domain\Memory\Commands\EditMemory;
use Domain\Memory\Commands\RemoveMemory;
use Domain\Memory\Commands\SaveMemory;
use Domain\Memory\Contracts\MemoryResolver;
use Domain\Memory\Enums\MemoryAbility;
use Domain\Memory\Exceptions\MemoryRevisionChanged;
use Domain\Memory\Exceptions\MemoryUnavailable;
use Domain\Memory\Models\Memory;
use Domain\Memory\Policies\MemoryPolicy;
use Domain\Memory\Skills\MemorySkill;

final class MemoryDomain extends Domain implements ProvidesCommands, ProvidesNumberedModels, ProvidesPolicies, ProvidesSkills
{
    use HasNumberedModels;

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
            ->exceptions(MemoryUnavailable::class, MemoryRevisionChanged::class)
            ->build();
    }

    public function numberedModels(): array
    {
        return [NumberedModel::global(Memory::class)];
    }

    public function policies(): array
    {
        return [new PolicyRegistration(Memory::class, MemoryPolicy::class, MemoryAbility::class)];
    }

    public function commands(): array
    {
        return [SaveMemory::class, EditMemory::class, RemoveMemory::class];
    }

    public function skills(): array
    {
        return [MemorySkill::class];
    }
}
