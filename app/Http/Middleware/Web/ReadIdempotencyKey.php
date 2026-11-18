<?php

declare(strict_types=1);

namespace App\Http\Middleware\Web;

use App\Bus\Support\RequestKey;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Reads a user's Idempotency-Key header into the request's key, so the write the request carries is receipted under
 * it; a command that requires a key is refused by the bus when the header is missing.
 */
final readonly class ReadIdempotencyKey
{
    private const string HEADER = 'Idempotency-Key';

    public function __construct(private RequestKey $key) {}

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->hasHeader(self::HEADER)) {
            $this->key->set((string) $request->header(self::HEADER));
        }

        return $next($request);
    }
}
