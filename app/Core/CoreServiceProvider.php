<?php

declare(strict_types=1);

namespace App\Core;

use App\Core\Agents\Models\Agent;
use App\Core\Agents\Models\AgentSession;
use App\Core\Agents\Models\LaunchBypass;
use App\Core\Agents\Models\LaunchCredential;
use App\Core\Hooks\Models\AgentStackRow;
use App\Core\Hooks\Models\HookCall;
use App\Core\Links\Models\Link;
use App\Core\Links\Support\LinkTypes;
use App\Domain\Exports;
use Illuminate\Foundation\Support\Providers\EventServiceProvider;
use Illuminate\Support\ServiceProvider;

/**
 * Loads the core that every domain and module builds on: the migrations and listeners of its agents, hooks and links.
 * The core names no domain; domains and modules plug into it.
 */
final class CoreServiceProvider extends ServiceProvider
{
    private const array AREAS = ['Agents', 'Hooks', 'Links'];

    public function register(): void
    {
        Exports::check('Core', __NAMESPACE__, CoreApi::exports());

        EventServiceProvider::addEventDiscoveryPaths(array_values(array_filter(
            array_map(fn (string $area) => __DIR__."/{$area}/Listeners", self::AREAS),
            is_dir(...),
        )));
    }

    public function boot(LinkTypes $links): void
    {
        $links->register([
            'core.agent' => Agent::class,
            'core.agent-session' => AgentSession::class,
            'core.launch-bypass' => LaunchBypass::class,
            'core.launch-credential' => LaunchCredential::class,
            'core.agent-stack' => AgentStackRow::class,
            'core.hook-call' => HookCall::class,
            'core.link' => Link::class,
        ]);

        foreach (self::AREAS as $area) {
            $this->loadMigrationsFrom(__DIR__."/{$area}/Database/Migrations");
        }
    }
}
