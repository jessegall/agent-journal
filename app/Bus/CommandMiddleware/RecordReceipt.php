<?php

declare(strict_types=1);

namespace App\Bus\CommandMiddleware;

use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Exceptions\RequestKeyMissing;
use App\Bus\Models\CommandReceipt;
use App\Bus\Support\CommandCall;
use App\Bus\Support\CommandRegistry;
use App\Bus\Support\ReceiptCallers;
use App\Bus\Support\RequestKey;
use Closure;

/**
 * Inside the outermost command's transaction: a request key the caller already used for the same write answers with
 * its stored result or refusal without running the command again; used for another write it is a conflict; past its
 * retention it is refused; unused, it is taken, the command runs and its result is stored in the same transaction, so
 * a rollback leaves the key free to retry. A command that requires a key is refused without one.
 */
final readonly class RecordReceipt implements CommandMiddleware
{
    public function __construct(private RequestKey $key, private ReceiptCallers $callers, private CommandRegistry $registry) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        if ($this->registry->requiresRequestKey($call->name()) && $this->key->isMissingForCurrentCommand()) {
            throw RequestKeyMissing::for($call->name());
        }

        $key = $this->key->keyOfCurrentCommand();

        if ($key === null) {
            return $next($call);
        }

        $caller = $this->callers->forCommand($call->name(), $call->actor());
        $receipt = CommandReceipt::lockedFor($caller, $call->name(), $key);

        if ($receipt !== null) {
            $receipt->requireFingerprint($call->command());

            return $receipt->replay();
        }

        $receipt = CommandReceipt::take($caller, $key, $call->command(), $this->registry->retentionOf($call->name()));
        $result = $next($call);
        $receipt->complete($result);

        return $result;
    }
}
