<?php

declare(strict_types=1);

namespace App\CommandMiddleware;

use App\Contracts\Bus\CommandMiddleware;
use App\Exceptions\RequestKeyConflict;
use App\Exceptions\RequestKeyMissing;
use App\Models\CommandReceipt;
use App\Support\AcceptedReceipt;
use App\Support\CommandCall;
use App\Support\CommandRegistry;
use App\Support\ReceiptCallers;
use App\Support\RequestKey;
use Closure;

/**
 * Inside the outermost command's transaction: a request key the caller already used for the same write answers with
 * its stored result or refusal without running the command again; used for another write it is a conflict; past its
 * retention it is refused; unused, it is taken, the command runs and its result is stored in the same transaction, so
 * a rollback leaves the key free to retry. A command that requires a key is refused without one.
 */
final readonly class RecordReceipt implements CommandMiddleware
{
    public function __construct(
        private RequestKey $key,
        private ReceiptCallers $callers,
        private CommandRegistry $registry,
        private AcceptedReceipt $accepted,
    ) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        if ($this->registry->requiresRequestKey($call->name()) && $this->key->isMissingForCurrentCommand()) {
            throw RequestKeyMissing::for($call->name());
        }

        $key = $this->key->keyOfCurrentCommand();

        if ($key === null) {
            return $next($call);
        }

        $this->key->markReceiptTaken();
        $caller = $this->callers->forCommand($call->name(), $call->actor());
        $receipt = CommandReceipt::lockedFor($caller, $call->name(), $key);

        if ($receipt !== null) {
            if (! $receipt->admitsCommand($call->command())) {
                throw RequestKeyConflict::for($receipt->request_key);
            }

            return $receipt->replay();
        }

        $receipt = CommandReceipt::create($caller, $key, $call->command(), $this->registry->retentionOf($call->name()));
        $this->accepted->accept($receipt->id);
        $commandReply = $next($call);
        $receipt->complete($commandReply);

        return $commandReply;
    }
}
