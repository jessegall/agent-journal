<?php

declare(strict_types=1);

namespace Domain\Memory\Providers;

use App\Actors\Contracts\ReadEntitlements;
use App\Actors\Values\ReadEntitlement;
use App\Links\Support\LinkTypeRegistry;
use Domain\Memory\Console\MemoryEditCommand;
use Domain\Memory\Console\MemoryListCommand;
use Domain\Memory\Console\MemoryRemoveCommand;
use Domain\Memory\Console\MemorySaveCommand;
use Domain\Memory\Contracts\MemoryResolver;
use Domain\Memory\Models\Memory;
use Domain\Memory\Policies\MemoryPolicy;
use Domain\Memory\Resolvers\OwnMemories;
use Illuminate\Support\ServiceProvider;

/**
 * Registers the stable link names of Memory's own models, binds the reader of the caller's own memories, and serves the
 * agent routes and console commands that keep, change, remove and list them.
 */
final class MemoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(MemoryResolver::class, OwnMemories::class);
    }

    public function boot(LinkTypeRegistry $links, ReadEntitlements $reads): void
    {
        $readGrant = ReadEntitlement::grant(MemoryPolicy::class);

        $reads->declare('memories_read', $readGrant);
        $reads->declare('memories_list', $readGrant);
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/agent.php');

        $this->commands(
            [MemorySaveCommand::class, MemoryEditCommand::class, MemoryRemoveCommand::class, MemoryListCommand::class],
        );

        $links->register([
            'memory.memory' => Memory::class,
        ]);
    }
}
