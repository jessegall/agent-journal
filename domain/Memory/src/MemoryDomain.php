<?php

declare(strict_types=1);

namespace Domain\Memory;

use App\Bus\Contracts\ProvidesCommands;
use App\Domains\Concerns\HasNumberedModels;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Numbers\Contracts\ProvidesNumberedModels;
use App\Numbers\Support\NumberedModel;
use App\Skills\Contracts\ProvidesSkills;
use Domain\Memory\Commands\RememberForAgent;
use Domain\Memory\Models\Memory;
use Domain\Memory\Skills\MemorySkill;

final class MemoryDomain extends Domain implements ProvidesCommands, ProvidesNumberedModels, ProvidesSkills
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
            ->build();
    }

    public function numberedModels(): array
    {
        return [NumberedModel::global(Memory::class)];
    }

    public function commands(): array
    {
        return [RememberForAgent::class];
    }

    public function skills(): array
    {
        return [MemorySkill::class];
    }
}
