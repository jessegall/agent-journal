<?php

declare(strict_types=1);

use App\Http\Middleware\Agents\AuthenticateAgent;
use App\Http\Middleware\Agents\ReadRequestKey;
use App\Http\Middleware\MeasureReads;
use App\Http\Middleware\Web\HandleInertiaRequests;
use Domain\Access\Http\Middleware\AuthenticateUser;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Routing\Middleware\ThrottleRequests;

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
        // An agent call is authenticated before it is throttled: the MCP rate limit counts per agent session.
        $middleware->prependToPriorityList(before: ThrottleRequests::class, prepend: AuthenticateAgent::class);
        $middleware->prependToPriorityList(before: SubstituteBindings::class, prepend: AuthenticateUser::class);
        $middleware->alias(['journal.user' => AuthenticateUser::class]);
        // A signed agent call is authenticated first; its body's request_key then keys the write it carries.
        $middleware->group('journal.agent', [AuthenticateAgent::class, ReadRequestKey::class]);
        // A message body is kept exactly as typed, its leading and trailing spaces and newlines included.
        $middleware->trimStrings(except: ['body']);
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
