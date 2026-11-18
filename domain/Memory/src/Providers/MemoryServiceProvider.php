<?php

declare(strict_types=1);

namespace Domain\Memory\Providers;

use App\Links\Support\LinkTypeRegistry;
use Domain\Memory\Models\Memory;
use Illuminate\Support\ServiceProvider;

/**
 * Registers the stable link names of Memory's own models.
 */
final class MemoryServiceProvider extends ServiceProvider
{
    public function boot(LinkTypeRegistry $links): void
    {
        $links->register([
            'memory.memory' => Memory::class,
        ]);
    }
}
