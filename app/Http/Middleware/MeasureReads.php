<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Contracts\Reads\ReadLog;
use App\Contracts\Reads\ReadMeter;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Measures each request from before its actor is known until its response is built, and logs what it read. A path
 * that carries a secret, an install line's ticket or a share's token, is logged without it.
 */
final readonly class MeasureReads
{
    private const string SECRET_PATH = '#^(install|s)/[^/]+#';

    public function __construct(private ReadMeter $meter, private ReadLog $log) {}

    public function handle(Request $request, Closure $next): Response
    {
        $path = (string) preg_replace(self::SECRET_PATH, '$1/{secret}', $request->path());
        $label = "{$request->method()} /{$path}";
        $measurement = $this->meter->measure($label, fn (): Response => $next($request));
        $this->log->record($label, $measurement->counts);

        return $measurement->measuredAnswer;
    }
}
