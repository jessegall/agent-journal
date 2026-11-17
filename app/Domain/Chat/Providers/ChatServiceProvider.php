<?php

declare(strict_types=1);

namespace App\Domain\Chat\Providers;

use App\Core\Agents\Exceptions\StackTargetRefused;
use App\Core\Links\Support\LinkTypeRegistry;
use App\Domain\Chat\Models\Message;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Foundation\Exceptions\Handler;
use Illuminate\Routing\Redirector;
use Illuminate\Support\ServiceProvider;

/**
 * Registers the stable link names of Chat's own models.
 */
final class ChatServiceProvider extends ServiceProvider
{
    public function boot(LinkTypeRegistry $links, ExceptionHandler $exceptions): void
    {
        $links->register([
            'chat.message' => Message::class,
        ]);

        // A session that can no longer take a message is a form error on the composer, not a failure.
        if ($exceptions instanceof Handler) {
            $exceptions->renderable(fn (StackTargetRefused $refused) => $this->app->make(Redirector::class)->back(303)->withErrors(['session' => 'This agent session cannot take a message now.']));
        }
    }
}
