<?php

declare(strict_types=1);

namespace App\Bus\CommandMiddleware;

use App\Bus\CommandCall;
use App\Bus\Contracts\CommandMiddleware;
use App\Exceptions\ModelMissing;
use App\Exceptions\RecordUnavailable;
use Closure;

/**
 * Answers a row a model could not find as the command's refusal: the record does not exist or is not available to the
 * actor, worded the same either way, so models never know about commands.
 */
final readonly class RefuseMissingModels implements CommandMiddleware
{
    public function handle(CommandCall $call, Closure $next): mixed
    {
        try {
            return $next($call);
        } catch (ModelMissing $missing) {
            throw RecordUnavailable::forMissing($missing);
        }
    }
}
