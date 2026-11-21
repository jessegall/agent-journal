<?php

declare(strict_types=1);

namespace App\Bus\CommandMiddleware;

use App\Actors\Exceptions\ActorNotAllowed;
use App\Bus\Contracts\CodedRefusal;
use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Contracts\ReceiptRefusal;
use App\Bus\Contracts\RefusalDetails;
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
    /**
     * The code of a refusal from an area that cannot carry one of its own.
     */
    private const array UNCODED_REFUSALS = [ActorNotAllowed::class => RefusalCode::Forbidden];

    public function __construct(
        private RequestKey $key,
        private ReceiptCallers $callers,
        private CommandRegistry $registry,
    ) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        return $this->key->dispatching(function () use ($call, $next): mixed {
            $key = $this->key->keyOfCurrentCommand();

            try {
                return $next($call);
            } catch (Throwable $failure) {
                if ($key !== null && $this->isFirstRefusal($failure)) {
                    $this->recordRefusal($call, $key, $failure);
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
        $code = self::codeOf($failure);
        $caller = $this->callers->forCommand($call->name(), $call->actor());
        $details = $failure instanceof RefusalDetails ? $failure->refusalDetails() : [];
        $taken = CommandReceipt::lockedFor($caller, $call->command()::class, $key);

        if ($taken !== null) {
            $taken->refuse($code, $failure->getMessage(), $details);

            return;
        }

        CommandReceipt::createRefused(
            $caller,
            $key,
            $call->command(),
            $this->registry->retentionOf($call->name()),
            $code,
            $failure->getMessage(),
            $details,
        );
    }

    /**
     * The refusal's code: its own when it carries one, forbidden for an actor its authorizer refused, else blocked.
     */
    private static function codeOf(Throwable $failure): RefusalCode
    {
        if ($failure instanceof CodedRefusal) {
            return $failure->refusalCode();
        }

        return self::UNCODED_REFUSALS[$failure::class] ?? RefusalCode::StateBlocked;
    }

    /**
     * A refusal the write got now, not one its key's receipt gave, which already has one.
     */
    private function isFirstRefusal(Throwable $failure): bool
    {
        return $failure instanceof CommandRefusal && ! $failure instanceof ReceiptRefusal;
    }
}
