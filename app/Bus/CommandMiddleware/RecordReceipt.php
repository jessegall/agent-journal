<?php

declare(strict_types=1);

namespace App\Bus\CommandMiddleware;

use App\Bus\AcceptedReceipt;
use App\Bus\CommandCall;
use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Exceptions\RequestKeyMissing;
use App\Bus\RequestKey;
use App\CommandRules\ReceiptCallers;
use App\Models\CommandRules\CommandReceipt;
use App\Skills\Exceptions\RequestKeyConflict;
use App\Support\CommandRegistry;
use Closure;

/**
 * Inside the outermost transaction: a request key already used for the same write answers with its stored result, one
 * used for another write is a conflict, and an expired one is refused; an unused key is taken and its result stored in
 * the same transaction. A command that requires a key is refused without one.
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
        $receipt = CommandReceipt::findLockedFor($caller, $call->name(), $key);

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
