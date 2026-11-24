<?php

declare(strict_types=1);

namespace App\CommandMiddleware;

use App\Commands\StartAgent\StartAgentCommand;
use App\Contracts\Bus\CommandMiddleware;
use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Refusals\StartRefusal;
use App\Exceptions\DriverCapabilityUnsupported;
use App\Models\Starts\StartRecord;
use App\Support\ActorIdentity;
use App\Support\CommandCall;
use App\Support\HeldStartRefusals;
use App\Support\StartRequestLock;
use App\Values\PinnedDriver;
use App\Values\StartRequest;
use Closure;
use Illuminate\Database\DatabaseManager;
use Throwable;

/**
 * Around a start's transaction, one request id at a time: a start that opens its own transaction first commits its
 * intent, and keeps a typed refusal on that record once the transaction has rolled back; a start inside another
 * command's transaction keeps it there and holds it for after that transaction's rollback.
 */
final readonly class KeepStartReceipt implements CommandMiddleware
{
    public function __construct(
        private DatabaseManager $databases,
        private StartRequestLock $locks,
        private HeldStartRefusals $heldRefusals,
        private DriverCatalogue $drivers,
    ) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        $command = $call->command();

        if (! $command instanceof StartAgentCommand) {
            return $next($call);
        }

        $request = $command->request;
        $requester = ActorIdentity::of($command->dispatchedBy());
        $start = fn () => $next($call);

        return $this->locks->hold(
            $request->requestId,
            fn () => $this->databases->connection()->transactionLevel() === 0
                ? $this->startInOwnTransaction($request, $requester, $start)
                : $this->startInOpenTransaction($request, $requester, $start),
        );
    }

    /**
     * The intent commits before admission, so the refusal finds its record after the rollback; a failure that is no
     * refusal leaves the key free again.
     *
     * @param  Closure(): mixed  $start
     */
    private function startInOwnTransaction(
        StartRequest $request,
        ActorIdentity $requester,
        Closure $start,
    ): mixed {
        $intent = StartRecord::accept($request, $this->pinOf($request), $requester);

        try {
            return $start();
        } catch (StartRefusal $refusal) {
            $intent->refuse($refusal);

            throw $refusal;
        } catch (Throwable $failure) {
            $intent->forgetIntent();

            throw $failure;
        }
    }

    /**
     * @param  Closure(): mixed  $start
     */
    private function startInOpenTransaction(
        StartRequest $request,
        ActorIdentity $requester,
        Closure $start,
    ): mixed {
        try {
            return $start();
        } catch (StartRefusal $refusal) {
            $pin = $this->pinOf($request);
            StartRecord::accept($request, $pin, $requester)->refuse($refusal);
            $this->heldRefusals->hold($request, $pin, $requester, $refusal);

            throw $refusal;
        }
    }

    /**
     * @throws DriverCapabilityUnsupported
     */
    private function pinOf(StartRequest $request): PinnedDriver
    {
        return $this->drivers->pinned($request->selection->driver, $request->variant, $request->neededCapabilities());
    }
}
