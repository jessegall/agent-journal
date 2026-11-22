<?php

declare(strict_types=1);

use App\Connections\Http\Middleware\ResolveConnectedProject;
use App\Http\Middleware\Agents\AuthenticateAgent;
use App\Http\Middleware\Agents\AuthenticateHost;
use App\Http\Middleware\Agents\ReadRequestKey;
use App\Http\Middleware\MeasureReads;
use App\Http\Middleware\Web\HandleInertiaRequests;
use App\Http\Middleware\Web\ReadIdempotencyKey;
use Domain\Access\Http\Middleware\AuthenticateUser;
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
    // Listeners are registered once, by App\Domains\Providers\DomainEventServiceProvider, through its checks.
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
        // A message body is kept exactly as typed, its leading and trailing spaces and newlines included.
        $middleware->trimStrings(except: ['body']);
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
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
