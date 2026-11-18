<?php

declare(strict_types=1);

namespace App\Http\Middleware\Agents;

use App\Bus\Support\RequestKey;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Reads the request_key of a signed agent call's JSON body into the request's key, so the write it carries is
 * receipted under it. The key travels inside the signed body, so the call's signature covers it.
 */
final readonly class ReadRequestKey
{
    private const string FIELD = 'request_key';

    public function __construct(private RequestKey $key) {}

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->filled(self::FIELD)) {
            $this->key->set($request->string(self::FIELD)->value());
        }

        return $next($request);
    }
}
