<?php

declare(strict_types=1);

namespace App\Core\Web\Providers;

use App\Core\Links\Support\LinkTypeRegistry;
use App\Core\Ui\Support\UiDeclarations;
use App\Core\Web\Console\GenerateUiManifest;
use App\Core\Web\Contracts\CurrentUserReader;
use App\Core\Web\Events\UserChannel;
use App\Core\Web\Http\Middleware\CheckPageVisibility;
use App\Core\Web\Models\Layout;
use App\Core\Web\Models\Support\CurrentUserScope;
use App\Core\Web\Pages\WebPages;
use App\Core\Web\Routes\DeclaredRoutes;
use App\Core\Web\Support\UiComponentFinder;
use App\Domain\DomainRegistry;
use Illuminate\Broadcasting\BroadcastManager;
use Illuminate\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Routing\Router;
use Illuminate\Support\ServiceProvider;
use Illuminate\View\FileViewFinder;

/**
 * Registers the browser routes, Web's own pages and every declared page and action of the installed domains among
 * them, and the private channel sign-in, the only place that does. It also names the saved layout for links and limits
 * it to the signed-in user each time the model boots.
 */
final class WebServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(UiDeclarations::class, fn ($app) => $app->make(DomainRegistry::class)->uiDeclarations(new WebPages()->declarations()));
        // Inertia's page check reads the declared components, and today's pages through its usual finder.
        $this->app->bind('inertia.view-finder', fn ($app) => new UiComponentFinder(
            $app->make(UiDeclarations::class),
            new FileViewFinder($app['files'], $app['config']->get('inertia.pages.paths'), $app['config']->get('inertia.pages.extensions')),
        ));
    }

    /**
     * Asking for the declared routes here makes a declaration the application cannot start with fail the boot.
     */
    public function boot(BroadcastManager $broadcast, LinkTypeRegistry $links, Dispatcher $events, Router $router, DeclaredRoutes $declaredRoutes): void
    {
        $links->register(['web.layout' => Layout::class]);
        $scope = new CurrentUserScope(static fn () => Container::getInstance()->make(CurrentUserReader::class));
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
    }
}
