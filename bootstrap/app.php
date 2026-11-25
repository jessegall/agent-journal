<?php

declare(strict_types=1);

use App\Http\Middleware\Agents\AuthenticateAgent;
use App\Http\Middleware\Agents\AuthenticateHost;
use App\Http\Middleware\Agents\ReadRequestKey;
use App\Http\Middleware\AuthenticateUser;
use App\Http\Middleware\MeasureReads;
use App\Http\Middleware\ResolveConnectedProject;
use App\Http\Middleware\Web\HandleInertiaRequests;
use App\Http\Middleware\Web\ReadIdempotencyKey;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Routing\Middleware\ThrottleRequests;

// The share-only listener runs this same entry with JOURNAL_LISTENER=sharing in its own process; no request picks it.
if (($_SERVER['JOURNAL_LISTENER'] ?? getenv('JOURNAL_LISTENER')) === 'sharing') {
    return require __DIR__.'/sharing.php';
}

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    // Listeners are registered once, by App\Providers\DomainEventServiceProvider, through its checks.
    ->withEvents(discover: false)
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->prepend(MeasureReads::class);
        // The app listens on 127.0.0.1 only, so whatever forwards to it is the server's own HTTPS proxy.
        $middleware->trustProxies(at: '*');
        // An agent call is authenticated before it is throttled: the MCP rate limit counts per agent session.
        $middleware->prependToPriorityList(before: ThrottleRequests::class, prepend: AuthenticateAgent::class);
        $middleware->prependToPriorityList(before: SubstituteBindings::class, prepend: AuthenticateUser::class);
        $middleware->alias(['journal.user' => AuthenticateUser::class, 'journal.host' => AuthenticateHost::class]);
        // A signed agent call is authenticated first; its body's request_key then keys the write it carries.
        // A connected project's agent serves its own project, named by its binding (ResolveConnectedProject).
        $middleware->group('journal.agent', [AuthenticateAgent::class, ResolveConnectedProject::class, ReadRequestKey::class]);
        // A message body is kept exactly as typed, and a project file's text exactly as its host read it, its leading and
        // trailing spaces and newlines included.
        $middleware->trimStrings(except: ['body', fn (Request $request) => $request->is('host/reports/project-reads/*')]);
        // A signed agent or host call reaches its handler exactly as it was signed: an empty string stays an empty string.
        $middleware->convertEmptyStringsToNull(except: [fn (Request $request) => $request->is('agent/*', 'host/*')]);
        // A user's write is receipted under the Idempotency-Key header it carries.
        $middleware->web(append: [
            ReadIdempotencyKey::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // An install line's ticket, a relay's credential, a device code, a command's input and a sign-in's code, key
        // or token never reach a flashed session or an exception report.
        $exceptions->dontFlash(['ticket', 'hostCredential', 'deviceCode', 'stdin', 'code', 'value']);
        // Every reported failure names its class and its message, whatever the page or the JSON answer says of it.
        $exceptions->context(fn (Throwable $failure): array => [
            'failure' => $failure::class,
            'message' => $failure->getMessage(),
        ]);
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
