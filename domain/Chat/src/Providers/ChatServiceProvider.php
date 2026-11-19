<?php

declare(strict_types=1);

namespace Domain\Chat\Providers;

use App\Agents\Exceptions\StackTargetRefused;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Foundation\Exceptions\Handler;
use Illuminate\Routing\Redirector;
use Illuminate\Support\ServiceProvider;

/**
 * Shows a session that can no longer take a message as a form error on Chat's composer.
 */
final class ChatServiceProvider extends ServiceProvider
{
    public function boot(ExceptionHandler $exceptions): void
    {
        // A session that can no longer take a message is a form error on the composer, not a failure.
        if ($exceptions instanceof Handler) {
            $exceptions->renderable(
                fn (StackTargetRefused $refused) => $this->app->make(Redirector::class)->back(303)->withErrors(
                    ['session' => 'This agent session cannot take a message now.'],
                ),
            );
        }
    }
}
