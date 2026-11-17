<?php

declare(strict_types=1);

namespace App\Domain\Web\Providers;

use App\Core\Hooks\Exceptions\StackTargetRefused;
use App\Core\Links\Support\LinkTypes;
use App\Domain\Access\Contracts\ViewerReader;
use App\Domain\Plans\Exceptions\PlanMissing;
use App\Domain\Plans\Exceptions\StartDenied;
use App\Domain\Rules\Exceptions\RuleMissing;
use App\Domain\Rules\Exceptions\RuleNotProposed;
use App\Domain\Web\Console\GenerateUiManifest;
use App\Domain\Web\Events\UserChannel;
use App\Domain\Web\Http\Middleware\CheckPageVisibility;
use App\Domain\Web\Models\Layout;
use App\Domain\Web\Models\Support\ViewerScope;
use App\Domain\Web\Support\DeclaredRoutes;
use Illuminate\Broadcasting\BroadcastManager;
use Illuminate\Container\Container;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Foundation\Exceptions\Handler;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;
use Illuminate\Routing\Router;
use Illuminate\Support\ServiceProvider;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Registers the browser routes, every declared page and action of the installed domains among them, and the private
 * channel sign-in, the only place that does, and turns the domain refusals the browser can act on into
 * a form error: only those, so a 403, a 404 or an unexpected failure keeps its own response. It also names the saved
 * layout for links and limits it to the signed-in user each time the model boots.
 */
final class WebServiceProvider extends ServiceProvider
{
    public function boot(ExceptionHandler $exceptions, BroadcastManager $broadcast, LinkTypes $links, Dispatcher $events, Router $router, DeclaredRoutes $declaredRoutes): void
    {
        $links->register(['web.layout' => Layout::class]);
        $scope = new ViewerScope(static fn () => Container::getInstance()->make(ViewerReader::class));
        $events->listen('eloquent.booted: '.Layout::class, fn () => Layout::addGlobalScope($scope));

        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/web.php');
        $this->commands([GenerateUiManifest::class]);
        $router->aliasMiddleware('journal.visible', CheckPageVisibility::class);

        if (! $this->app->routesAreCached()) {
            $declaredRoutes->register($router);
        }

        // Every provider has registered its routes by now, cached or not, so a prefix someone else uses is found.
        $this->app->booted(fn () => $declaredRoutes->refuseTakenPrefixes($router->getRoutes(), $this->app->publicPath()));
        // The channel sign-in runs behind the same session, sign-in and user checks as every page.
        $broadcast->routes(['middleware' => ['web', 'auth', 'journal.user']]);
        $broadcast->channel(UserChannel::PATTERN, UserChannel::class);

        if ($exceptions instanceof Handler) {
            $exceptions->map(PlanMissing::class, fn (PlanMissing $missing) => new NotFoundHttpException(previous: $missing));
            $exceptions->map(RuleMissing::class, fn (RuleMissing $missing) => new NotFoundHttpException(previous: $missing));
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
