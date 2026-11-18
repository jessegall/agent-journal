<?php

declare(strict_types=1);

namespace Domain\Memory;

use App\Bus\Contracts\ProvidesCommands;
use App\Domains\Concerns\HasNumberedModels;
use App\Domains\Support\Domain;
use App\Numbers\Contracts\ProvidesNumberedModels;
use App\Numbers\Support\NumberedModel;
use Domain\Memory\Commands\RememberForAgent;
use Domain\Memory\Models\Memory;

final class MemoryDomain extends Domain implements ProvidesCommands, ProvidesNumberedModels
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

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [];
    }

    public function numberedModels(): array
    {
        return [NumberedModel::global(Memory::class)];
    }

    public function commands(): array
    {
        return [RememberForAgent::class];
    }
}
