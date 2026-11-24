<?php

declare(strict_types=1);

namespace App\CommandMiddleware;

use App\Contracts\Bus\CommandMiddleware;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Bus\ReceiptRefusal;
use App\Contracts\Refusals\RefusalDetails;
use App\Contracts\Work\StackTransactionRunner;
use App\Enums\RefusalCode;
use App\Models\CommandRules\CommandReceipt;
use App\Support\CommandCall;
use App\Support\CommandRegistry;
use App\Support\ReceiptCallers;
use App\Support\RequestKey;
use Closure;
use Throwable;

/**
 * Before the transaction: counts how deep each dispatch is nested, so only the outermost command is receipted, and
 * stores the refusal an outermost keyed write got once its transaction has rolled back, in one statement, so a retry
 * with the same key gets the same refusal. A failure that is no refusal stores nothing and the key stays free.
 */
final readonly class RecordRefusalReceipt implements CommandMiddleware
{
    public function __construct(
        private RequestKey $key,
        private ReceiptCallers $callers,
        private CommandRegistry $registry,
        private StackTransactionRunner $transaction,
    ) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        return $this->key->dispatching(function () use ($call, $next): mixed {
            $key = $this->key->keyOfCurrentCommand();

            try {
                return $next($call);
            } catch (Throwable $failure) {
                if ($key !== null && $this->isFirstRefusal($failure)) {
                    // The command's transaction rolled back, so the refusal is kept in a transaction of its own.
                    $this->transaction->run(fn () => $this->recordRefusal($call, $key, $failure));
                }

                throw $failure;
            }
        });
    }

    /**
     * Stores the refusal a write got after its transaction rolled back; when the write ran inside a transaction it
     * joined, nothing rolled back, so the key it took is marked refused instead.
     */
    private function recordRefusal(CommandCall $call, string $key, Throwable $failure): void
    {
        $code = RefusalCode::of($failure);
        $caller = $this->callers->forCommand($call->name(), $call->actor());
        $details = $failure instanceof RefusalDetails ? $failure->refusalDetails() : [];
        $taken = CommandReceipt::lockedFor($caller, $call->command()::class, $key);

        if ($taken !== null) {
            $taken->refuse($code, $failure->getMessage(), $details);

            return;
        }

        CommandReceipt::create($caller, $key, $call->command(), $this->registry->retentionOf($call->name()))
            ->refuse($code, $failure->getMessage(), $details);
    }

    /**
     * A refusal the write got now, not one its key's receipt gave, which already has one.
     */
    private function isFirstRefusal(Throwable $failure): bool
    {
        return $failure instanceof CommandRefusal && ! $failure instanceof ReceiptRefusal;
    }
}
