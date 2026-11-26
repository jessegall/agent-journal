<?php

declare(strict_types=1);

namespace App\Providers;

use App\Access\Contracts\PolicyCatalogue;
use App\Access\Values\PolicyDefinition;
use App\Actors\Contracts\CurrentUserResolver;
use App\Agents\Drivers\Contracts\InstalledVersion as InstalledVersionContract;
use App\Agents\Enums\AccessType;
use App\Assignments\Contracts\AutoAssignmentAccess;
use App\Bus\Contracts\CommandRefusal;
use App\Concerns\LoadsCoreRoutes;
use App\Console\Commands\GenerateClientManifest;
use App\Contracts\Refusals\CodedRefusal;
use App\Contracts\Refusals\StartRefusal;
use App\CorePages;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Http\Middleware\Web\CheckPageVisibility;
use App\Models\Records\Layout;
use App\Models\Support\CurrentUserScope;
use App\Navigation\Contracts\ClientOwnerAvailability as ClientOwnerAvailabilityContract;
use App\Navigation\Contracts\DeclaredPages;
use App\Navigation\Contracts\DraftProducers as DraftProducersContract;
use App\Navigation\Contracts\NavigationRecords as NavigationRecordsContract;
use App\Navigation\Contracts\RecordMenus as RecordMenusContract;
use App\Navigation\Contracts\SlotSections;
use App\Navigation\Contracts\WindowOffers;
use App\Navigation\Contracts\WindowResults as WindowResultsContract;
use App\Navigation\NoWindowOffers;
use App\Notifications\Contracts\Refusals\FieldRefusal;
use App\Policies\LayoutPolicy;
use App\Policies\PresencePolicy;
use App\Reads\Contracts\ReaderRequests as ReaderRequestsContract;
use App\Reads\ReaderRequests;
use App\Settings\Contracts\SettingsAccessPolicy;
use App\Settings\OwnerSettingsAccess;
use App\Support\ClientComponentFinder;
use App\Support\ClientDeclarations;
use App\Support\ClientOwnerAvailability;
use App\Support\DeclaredRoutes;
use App\Support\DomainRegistry;
use App\Support\DraftProducers;
use App\Support\InstalledVersion;
use App\Support\NavigationRecords;
use App\Support\OwnerAutoAssignmentAccess;
use App\Support\PageChangeBroadcastLog;
use App\Support\ProtectedViews;
use App\Support\RecordMenus;
use App\Support\RefusalReason;
use App\Support\WindowResults;
use App\Values\FilePath;
use App\Web\Contracts\ProtectedViews as ProtectedViewsContract;
use App\Web\InstallationFaults;
use App\Web\UserChannel;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Broadcasting\BroadcastManager;
use Illuminate\Container\Container;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Foundation\Exceptions\Handler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
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
    use LoadsCoreRoutes;

    public function register(): void
    {
        $this->app->bind(NavigationRecordsContract::class, NavigationRecords::class);
        $this->app->bind(RecordMenusContract::class, RecordMenus::class);
        $this->app->singleton(DraftProducers::class);
        $this->app->alias(DraftProducers::class, DraftProducersContract::class);
        $this->app->bind(InstalledVersionContract::class, InstalledVersion::class);
        $this->app->bind(ProtectedViewsContract::class, ProtectedViews::class);

        $this->app->bind(
            InstallationFaults::class,
            fn () => new InstallationFaults(
                $this->app->make(Files::class),
                FilePath::in(Place::Project, 'storage/installation/faults'),
            ),
        );

        $this->app->bind(ReaderRequestsContract::class, ReaderRequests::class);
        $this->app->bind(WindowResultsContract::class, WindowResults::class);
        $this->app->bindIf(WindowOffers::class, NoWindowOffers::class);
        $this->app->bind(ClientOwnerAvailabilityContract::class, ClientOwnerAvailability::class);
        $this->app->bind(SettingsAccessPolicy::class, OwnerSettingsAccess::class);
        $this->app->bind(AutoAssignmentAccess::class, OwnerAutoAssignmentAccess::class);

        $this->app->singleton(
            ClientDeclarations::class,
            fn ($app) => $app->make(DomainRegistry::class)->clientDeclarations(...CorePages::declarations()),
        );

        $this->app->bind(SlotSections::class, ClientDeclarations::class);
        $this->app->bind(DeclaredPages::class, ClientDeclarations::class);

        // Inertia's page check reads the declared components, and today's pages through its usual finder.
        $this->app->bind('inertia.view-finder', fn ($app) => new ClientComponentFinder(
            $app->make(ClientDeclarations::class),
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

        $policies->register(
            'Core',
            new PolicyDefinition(LayoutPolicy::class, [AccessType::Create, AccessType::Edit, AccessType::Delete]),
        );

        $this->renderRefusals($exceptions);
        $scope = new CurrentUserScope(static fn () => Container::getInstance()->make(CurrentUserResolver::class));
        $events->listen('eloquent.booted: '.Layout::class, fn () => Layout::addGlobalScope($scope));

        $this->loadCoreRoutes('web/web.php');
        $this->commands([GenerateClientManifest::class]);
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
     * The form field a refusal is shown under: a start refusal's own next step names it, every other refusal is the
     * whole command's.
     */
    /**
     * @return array<string, string>
     */
    private static function fieldErrorOf(CommandRefusal $refusal): array
    {
        if ($refusal instanceof FieldRefusal) {
            return [$refusal->field() => $refusal->fieldError()];
        }

        return [self::fieldOf($refusal) => $refusal->getMessage()];
    }

    private static function fieldOf(CommandRefusal $refusal): string
    {
        if ($refusal instanceof StartRefusal) {
            return $refusal->reason()->remedy()->type->field();
        }

        return 'command';
    }

    /**
     * A refused command is a form error on a web page, with its stable code flashed beside it, and on a browser's JSON
     * request its code, message and fields with its status. Refused input and an expired sign-in answer a JSON caller
     * the same way. The text names no class and holds no trace.
     */
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

            if ($request->expectsJson()) {
                return $this->refusalAnswer($reason->code, $failure->getMessage(), [], $reason->status);
            }

            return $this->app->make(Redirector::class)
                ->back(303)
                ->withErrors(self::fieldErrorOf($failure))
                ->with(CommandRefusal::CODE_FLASH_KEY, $reason->code);
        });

        // A coded refusal of a read, such as a page cursor that no longer fits, answers with its own status, so a
        // partial reload hears why its read was refused.
        $exceptions->renderable(function (Throwable $refused, Request $request): JsonResponse|Response|null {
            if (! $refused instanceof CodedRefusal || ! $request->hasSession() || $refused instanceof CommandRefusal) {
                return null;
            }

            $status = $refused->refusalCode()->status();

            if ($request->expectsJson()) {
                return $this->refusalAnswer($refused->refusalCode()->value, $refused->getMessage(), [], $status);
            }

            return new Response($refused->getMessage(), $status);
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
