<?php

declare(strict_types=1);

namespace App\Providers;

use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Models\LaunchBypass;
use App\Agents\Models\LaunchCredential;
use App\Comments\Models\Comment;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Models\HookCall;
use App\Links\Models\Link;
use App\Links\Support\LinkTypeRegistry;
use App\Settings\Models\SettingsRecord;
use Illuminate\Support\ServiceProvider;

/**
 * Loads the core that every domain and module builds on: the migrations and listeners of its agents, hooks and links.
 * The core names no domain; domains and modules plug into it.
 */
final class CoreServiceProvider extends ServiceProvider
{
    private const array AREAS = ['Actors', 'Agents', 'Assignments', 'Comments', 'Engine', 'Hooks', 'Links', 'Numbers', 'Settings', 'Web'];

    public function boot(LinkTypeRegistry $links): void
    {
        $links->register([
            'core.agent' => Agent::class,
            'core.agent-session' => AgentSession::class,
            'core.launch-bypass' => LaunchBypass::class,
            'core.launch-credential' => LaunchCredential::class,
            'core.agent-stack' => AgentStackRow::class,
            'core.hook-call' => HookCall::class,
            'core.link' => Link::class,
            'core.comment' => Comment::class,
            'core.settings-record' => SettingsRecord::class,
        ]);

        foreach (self::AREAS as $area) {
            $this->loadMigrationsFrom(dirname(__DIR__)."/{$area}/Database/Migrations");
        }
    }
}
