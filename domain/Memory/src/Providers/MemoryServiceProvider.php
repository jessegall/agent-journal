<?php

declare(strict_types=1);

namespace Domain\Memory\Providers;

use App\Links\Support\LinkTypeRegistry;
use Domain\Memory\Console\MemoryEditCommand;
use Domain\Memory\Console\MemoryListCommand;
use Domain\Memory\Console\MemoryRemoveCommand;
use Domain\Memory\Console\MemorySaveCommand;
use Domain\Memory\Contracts\MemoryReader;
use Domain\Memory\Models\Memory;
use Domain\Memory\Readers\OwnMemories;
use Illuminate\Support\ServiceProvider;

/**
 * Registers the stable link names of Memory's own models, binds the reader of the caller's own memories, and serves the
 * agent routes and console commands that keep, change, remove and list them.
 */
final class MemoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(MemoryReader::class, OwnMemories::class);
    }

    public function boot(LinkTypeRegistry $links): void
    {
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/agent.php');
        $this->commands([MemorySaveCommand::class, MemoryEditCommand::class, MemoryRemoveCommand::class, MemoryListCommand::class]);
        $links->register([
            'memory.memory' => Memory::class,
        ]);
    }
}
