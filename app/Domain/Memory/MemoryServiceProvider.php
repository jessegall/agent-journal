<?php

declare(strict_types=1);

namespace App\Domain\Memory;

use App\Core\Links\Support\LinkTypes;
use App\Domain\Memory\Models\Memory;
use Illuminate\Support\ServiceProvider;

/**
 * Registers the stable link names of Memory's own models.
 */
final class MemoryServiceProvider extends ServiceProvider
{
    public function boot(LinkTypes $links): void
    {
        $links->register([
            'memory.memory' => Memory::class,
        ]);
    }
}
