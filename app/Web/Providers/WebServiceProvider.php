<?php

declare(strict_types=1);

namespace App\Web\Providers;

use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Values\PolicyDefinition;
use App\Agents\Contracts\StartRefusal;
use App\Assignments\Contracts\AutoAssignmentAccess;
use App\Bus\Support\RefusalReason;
use App\Contracts\CommandRefusal;
use App\CorePages;
use App\Domains\Support\DomainRegistry;
use App\Http\Middleware\Web\CheckPageVisibility;
use App\Links\Support\LinkTypeRegistry;
use App\Operations\Enums\AccessType;
use App\Settings\Contracts\SettingsAccessPolicy;
use App\Ui\Contracts\DeclaredPages;
use App\Ui\Contracts\DraftProducers;
use App\Ui\Contracts\RecordMenus as RecordMenusContract;
use App\Ui\Contracts\SlotSections;
use App\Ui\Support\DraftProducerRegistry;
use App\Ui\Support\UiDeclarations;
use App\Web\Console\GenerateUiManifest;
use App\Web\Contracts\CurrentUserResolver;
use App\Web\Contracts\InstalledVersion as InstalledVersionContract;
use App\Web\Contracts\NavigationRecords as NavigationRecordsContract;
use App\Web\Contracts\ReaderRequests as ReaderRequestsContract;
use App\Web\Contracts\UiOwnerAvailability as UiOwnerAvailabilityContract;
use App\Web\Contracts\WindowResults as WindowResultsContract;
use App\Web\Models\Layout;
use App\Web\Models\Support\CurrentUserScope;
use App\Web\Policies\PresencePolicy;
use App\Web\Routes\DeclaredRoutes;
use App\Web\Support\InstalledVersion;
use App\Web\Support\NavigationRecords;
use App\Web\Support\OwnerAutoAssignmentAccess;
use App\Web\Support\OwnerSettingsAccess;
use App\Web\Support\PageChangeBroadcastLog;
use App\Web\Support\ReaderRequests;
use App\Web\Support\RecordMenus;
use App\Web\Support\UiComponentFinder;
use App\Web\Support\UiOwnerAvailability;
use App\Web\Support\UserChannel;
use App\Web\Support\WindowResults;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Broadcasting\BroadcastManager;
use Illuminate\Container\Container;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Foundation\Exceptions\Handler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Queue\Events\JobProcessing;
use Illuminate\Routing\Redirector;
use Illuminate\Routing\Router;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\ValidationException;
use Illuminate\View\FileViewFinder;
use Throwable;

/**
 * Registers the browser routes, Web's own pages and every declared page and action of the installed domains among
 * them, and the private channel sign-in, the only place that does. It also names the saved layout for links and limits
 * it to the signed-in user each time the model boots.
 */
final class WebServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(NavigationRecordsContract::class, NavigationRecords::class);
        $this->app->bind(RecordMenusContract::class, RecordMenus::class);
        $this->app->singleton(DraftProducerRegistry::class);
        $this->app->alias(DraftProducerRegistry::class, DraftProducers::class);
        $this->app->bind(InstalledVersionContract::class, InstalledVersion::class);
        $this->app->bind(ReaderRequestsContract::class, ReaderRequests::class);
        $this->app->bind(WindowResultsContract::class, WindowResults::class);
        $this->app->bind(UiOwnerAvailabilityContract::class, UiOwnerAvailability::class);
        $this->app->bind(SettingsAccessPolicy::class, OwnerSettingsAccess::class);
        $this->app->bind(AutoAssignmentAccess::class, OwnerAutoAssignmentAccess::class);

        $this->app->singleton(
            UiDeclarations::class,
            fn ($app) => $app->make(DomainRegistry::class)->uiDeclarations(...CorePages::declarations()),
        );

        $this->app->bind(SlotSections::class, UiDeclarations::class);
        $this->app->bind(DeclaredPages::class, UiDeclarations::class);

        // Inertia's page check reads the declared components, and today's pages through its usual finder.
        $this->app->bind('inertia.view-finder', fn ($app) => new UiComponentFinder(
            $app->make(UiDeclarations::class),
            new FileViewFinder(
                $app['files'],
                $app['config']->get('inertia.pages.paths'),
                $app['config']->get('inertia.pages.extensions'),
            ),
            $app->basePath(),
        ));
    }

    /**
     * Asking for the declared routes here makes a declaration the application cannot start with fail the boot.
     */
    public function boot(
        BroadcastManager $broadcast,
        LinkTypeRegistry $links,
        Dispatcher $events,
        Router $router,
        DeclaredRoutes $declaredRoutes,
        ExceptionHandler $exceptions,
        PolicyCatalogue $policies,
    ): void {
        $policies->register(
            'Core',
            new PolicyDefinition(PresencePolicy::class, [AccessType::Edit]),
        );

        $links->register(['web.layout' => Layout::class]);
        $this->renderRefusals($exceptions);
        $scope = new CurrentUserScope(static fn () => Container::getInstance()->make(CurrentUserResolver::class));
        $events->listen('eloquent.booted: '.Layout::class, fn () => Layout::addGlobalScope($scope));

        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/web.php');
        $this->commands([GenerateUiManifest::class]);
        $router->aliasMiddleware('journal.visible', CheckPageVisibility::class);

        if (! $this->app->routesAreCached()) {
            $declaredRoutes->register($router);
        }

        // Every provider has registered its routes by now, cached or not, so a prefix someone else uses is found.
        $this->app->booted(
            fn () => $declaredRoutes->refuseTakenPrefixes($router->getRoutes(), $this->app->publicPath()),
        );

        // The channel sign-in runs behind the same session, sign-in and user checks as every page.
        $broadcast->routes(['middleware' => ['web', 'auth', 'journal.user']]);
        $broadcast->channel(UserChannel::PATTERN, UserChannel::class);
        $events->listen(JobProcessing::class, [PageChangeBroadcastLog::class, 'record']);
    }

    /**
     * A refused command is a form error on a web page, with its stable code flashed beside it, and on a browser's JSON
     * request its code, message and fields with its status. Refused input and an expired sign-in answer a JSON caller
     * the same way. The text names no class and holds no trace.
     */
    /**
     * The form field a refusal is shown under: a start refusal's own next step names it, every other refusal is the
     * whole command's.
     */
    private static function fieldOf(CommandRefusal $refusal): string
    {
        return $refusal instanceof StartRefusal ? $refusal->reason()->remedy()->type->field() : 'command';
    }

    private function renderRefusals(ExceptionHandler $exceptions): void
    {
        if (! $exceptions instanceof Handler) {
            return;
        }

        $exceptions->renderable(function (Throwable $failure, Request $request): JsonResponse|RedirectResponse|null {
            if (! $failure instanceof CommandRefusal || $failure instanceof ValidationException) {
                return null;
            }

            $reason = RefusalReason::of($failure);

            return $request->expectsJson()
                ? $this->refusalAnswer($reason->code, $failure->getMessage(), [], $reason->status)
                : $this->app->make(Redirector::class)
                    ->back(303)
                    ->withErrors([self::fieldOf($failure) => $failure->getMessage()])
                    ->with(CommandRefusal::CODE_FLASH_KEY, $reason->code);
        });

        $exceptions->renderable(function (ValidationException $refused, Request $request): JsonResponse|null {
            if (! $request->expectsJson() || ! $request->hasSession()) {
                return null;
            }

            $fields = array_map(fn (array $messages) => (string) reset($messages), $refused->errors());

            return $this->refusalAnswer('invalid-input', $refused->getMessage(), $fields, 422);
        });

        $exceptions->renderable(function (AuthenticationException $expired, Request $request): JsonResponse|null {
            if (! $request->expectsJson() || ! $request->hasSession()) {
                return null;
            }

            return $this->refusalAnswer('signed-out', $expired->getMessage(), [], 401);
        });
    }

    /**
     * @param  array<string, string>  $fields
     */
    private function refusalAnswer(string $code, string $message, array $fields, int $status): JsonResponse
    {
        return new JsonResponse(['code' => $code, 'message' => $message, 'fields' => (object) $fields], $status);
    }
}
