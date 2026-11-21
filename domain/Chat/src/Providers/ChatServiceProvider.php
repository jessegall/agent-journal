<?php

declare(strict_types=1);

namespace Domain\Chat\Providers;

use App\Actors\Contracts\ReadEntitlements;
use App\Actors\Values\ReadEntitlement;
use App\Agents\Exceptions\SessionOutdated;
use App\Agents\Exceptions\StackTargetRefused;
use App\Autoload\Support\FolderClasses;
use App\Docking\Sources\Contracts\DockOffers;
use Domain\Chat\Support\AgentDockOffers;
use Illuminate\Console\Command;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Foundation\Exceptions\Handler;
use Illuminate\Routing\Redirector;
use Illuminate\Support\ServiceProvider;

/**
 * Chat's journal dock commands and their signed routes, and a session that can no longer take a message shown as a
 * form error on Chat's composer.
 */
final class ChatServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(DockOffers::class, AgentDockOffers::class);
    }

    public function boot(ExceptionHandler $exceptions, ReadEntitlements $reads): void
    {
        $reads->declare('dock_list', ReadEntitlement::resolver());
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/agent.php');
        $this->commands(FolderClasses::in(dirname(__DIR__).'/Console', Command::class));

        // A session that can no longer take a message is a form error on the composer, not a failure.
        if ($exceptions instanceof Handler) {
            $exceptions->renderable(
                fn (StackTargetRefused $refused) => $this->app->make(Redirector::class)->back(303)->withErrors(
                    ['session' => 'This agent session cannot take a message now.'],
                ),
            );
            $exceptions->renderable(
                fn (SessionOutdated $outdated) => $this->app->make(Redirector::class)->back(303)->withErrors(
                    ['session' => 'The agent now runs another session. Send the message again to reach it.'],
                ),
            );
        }
    }
}
