<?php

declare(strict_types=1);

namespace App\Bus\CommandMiddleware;

use App\Actors\Exceptions\ActorContextMissing;
use App\Bus\Contracts\CallerSession;
use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Exceptions\RequestKeyConflict;
use App\Bus\Models\CommandReceipt;
use App\Bus\Support\CommandCall;
use App\Bus\Support\RequestKey;
use Closure;

/**
 * Inside the outermost command's transaction: a request key already used for the same write answers with its stored
 * result or refusal without running the command again; used for another write it is a conflict; unused, it is taken,
 * the command runs and its result is stored in the same transaction, so a rollback leaves the key free to retry.
 */
final readonly class RecordReceipt implements CommandMiddleware
{
    public function __construct(private RequestKey $key, private CallerSession $session) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        $key = $this->key->keyOfCurrentCommand();

        if ($key === null) {
            return $next($call);
        }

        $receipt = CommandReceipt::lockedFor($key);

        if ($receipt !== null && ! $receipt->isFor($call->command())) {
            throw RequestKeyConflict::for($key);
        }

        if ($receipt !== null) {
            return $receipt->replay();
        }

        $receipt = CommandReceipt::take($this->session->sessionId(), $key, $call->command(), $call->actor() ?? throw ActorContextMissing::forRequest());
        $result = $next($call);
        $receipt->complete($result);

        return $result;
    }
}
