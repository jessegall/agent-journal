<?php

declare(strict_types=1);

namespace App\Domain\Web;

use App\Core\Hooks\Exceptions\StackTargetRefused;
use App\Domain\Plans\Exceptions\StartDenied;
use App\Domain\Rules\Exceptions\RuleNotProposed;
use App\Domain\Web\Events\PersonChannel;
use Illuminate\Broadcasting\BroadcastManager;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Foundation\Exceptions\Handler;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;
use Illuminate\Support\ServiceProvider;

/**
 * Registers the browser routes and the private channel sign-in, the only place that does, and turns the domain refusals the browser can act on into
 * a form error: only those, so a 403, a 404 or an unexpected failure keeps its own response.
 */
final class WebServiceProvider extends ServiceProvider
{
    public function boot(ExceptionHandler $exceptions, BroadcastManager $broadcast): void
    {
        $this->loadRoutesFrom(__DIR__.'/Routes/web.php');
        // The channel sign-in runs behind the same session, sign-in and person checks as every page.
        $broadcast->routes(['middleware' => ['web', 'auth', 'journal.person']]);
        $broadcast->channel(PersonChannel::PATTERN, PersonChannel::class);

        if ($exceptions instanceof Handler) {
            $exceptions->renderable(fn (StartDenied $denied) => $this->backWithError('start', $denied->getMessage()));
            $exceptions->renderable(fn (RuleNotProposed $settled) => $this->backWithError('review', $settled->getMessage()));
            $exceptions->renderable(fn (StackTargetRefused $refused) => $this->backWithError('session', 'This agent session cannot take a message now.'));
        }
    }

    private function backWithError(string $field, string $message): RedirectResponse
    {
        return $this->app->make(Redirector::class)->back(303)->withErrors([$field => $message]);
    }
}
