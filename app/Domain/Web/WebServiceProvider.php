<?php

declare(strict_types=1);

namespace App\Domain\Web;

use App\Core\Hooks\Exceptions\StackTargetRefused;
use App\Domain\Plans\Exceptions\StartDenied;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Foundation\Exceptions\Handler;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;
use Illuminate\Support\ServiceProvider;

/**
 * Registers the browser routes, the only place that does, and turns the domain refusals the browser can act on into
 * a form error: only those, so a 403, a 404 or an unexpected failure keeps its own response.
 */
final class WebServiceProvider extends ServiceProvider
{
    public function boot(ExceptionHandler $exceptions): void
    {
        $this->loadRoutesFrom(__DIR__.'/Routes/web.php');

        if ($exceptions instanceof Handler) {
            $exceptions->renderable(fn (StartDenied $denied) => $this->backWithError('start', $denied->getMessage()));
            $exceptions->renderable(fn (StackTargetRefused $refused) => $this->backWithError('session', 'This agent session cannot take a message now.'));
        }
    }

    private function backWithError(string $field, string $message): RedirectResponse
    {
        return $this->app->make(Redirector::class)->back(303)->withErrors([$field => $message]);
    }
}
