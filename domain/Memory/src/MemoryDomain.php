<?php

declare(strict_types=1);

namespace Domain\Memory;

use App\Bus\Contracts\ProvidesCommands;
use App\Domains\Concerns\HasNumberedModels;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Numbers\Contracts\ProvidesNumberedModels;
use App\Numbers\Support\NumberedModel;
use Domain\Memory\Api\MemoryCard;
use Domain\Memory\Api\MemoryPage;
use Domain\Memory\Commands\EditMemory;
use Domain\Memory\Commands\RemoveMemory;
use Domain\Memory\Commands\SaveMemory;
use Domain\Memory\Contracts\MemoryReader;
use Domain\Memory\Exceptions\MemoryInvalid;
use Domain\Memory\Exceptions\MemoryUnavailable;
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

    public function exports(): Exports
    {
        return Exports::make()
            ->contracts(MemoryReader::class)
            ->values(MemoryPage::class, MemoryCard::class)
            ->exceptions(MemoryUnavailable::class, MemoryInvalid::class)
            ->build();
    }

    public function numberedModels(): array
    {
        return [NumberedModel::global(Memory::class)];
    }

    public function commands(): array
    {
        return [SaveMemory::class, EditMemory::class, RemoveMemory::class];
    }
}
