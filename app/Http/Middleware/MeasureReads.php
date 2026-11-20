<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Reads\Contracts\ReadLog;
use App\Reads\Contracts\ReadMeter;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Measures each request from before its actor is known until its response is built, and logs what it read.
 */
final readonly class MeasureReads
{
    public function __construct(private ReadMeter $meter, private ReadLog $log) {}

    public function handle(Request $request, Closure $next): Response
    {
        $label = "{$request->method()} /{$request->path()}";
        $measurement = $this->meter->measure($label, fn (): Response => $next($request));
        $this->log->record($label, $measurement->counts);

        return $measurement->value;
    }
}
