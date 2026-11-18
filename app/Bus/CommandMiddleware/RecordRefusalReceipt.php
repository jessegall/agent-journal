<?php

declare(strict_types=1);

namespace App\Bus\CommandMiddleware;

use App\Bus\Contracts\AnswersFromReceipt;
use App\Bus\Contracts\CodedRefusal;
use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Enums\RefusalCode;
use App\Bus\Models\CommandReceipt;
use App\Bus\Support\CommandCall;
use App\Bus\Support\CommandRegistry;
use App\Bus\Support\ReceiptCallers;
use App\Bus\Support\RequestKey;
use App\Contracts\CommandRefusal;
use Closure;
use Throwable;

/**
 * Before the transaction: counts how deep each dispatch is nested, so only the outermost command is receipted, and
 * stores the refusal an outermost keyed write got once its transaction has rolled back, in one statement, so a retry
 * with the same key gets the same refusal. A failure that is no refusal stores nothing and the key stays free.
 */
final readonly class RecordRefusalReceipt implements CommandMiddleware
{
    public function __construct(private RequestKey $key, private ReceiptCallers $callers, private CommandRegistry $registry) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        return $this->key->dispatching(function () use ($call, $next): mixed {
            $key = $this->key->keyOfCurrentCommand();

            try {
                return $next($call);
            } catch (Throwable $failure) {
                if ($key !== null && $this->isFirstRefusal($failure)) {
                    $code = $failure instanceof CodedRefusal ? $failure->refusalCode() : RefusalCode::StateBlocked;
                    $caller = $this->callers->of($call->actor());
                    CommandReceipt::recordRefusal($caller, $key, $call->command(), $this->registry->retentionOf($call->name()), $code, $failure->getMessage());
                }

                throw $failure;
            }
        });
    }

    /**
     * A refusal the write got now, not one its key's receipt gave, which already has one.
     */
    private function isFirstRefusal(Throwable $failure): bool
    {
        return $failure instanceof CommandRefusal && ! $failure instanceof AnswersFromReceipt;
    }
}
