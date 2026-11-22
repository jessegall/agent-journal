<?php

declare(strict_types=1);

namespace App\Agents\CommandMiddleware;

use App\Actors\Contracts\ReplyInboxes;
use App\Actors\Support\ActorIdentity;
use App\Agents\Commands\StartAgent\StartAgentCommand;
use App\Agents\Contracts\StartRefusal;
use App\Agents\Models\StartRecord;
use App\Agents\Support\HeldStartRefusals;
use App\Agents\Support\StartRequestLock;
use App\Agents\Values\StartRequest;
use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Support\CommandCall;
use App\Drivers\Contracts\DriverCatalogue;
use App\Drivers\Exceptions\DriverCapabilityUnsupported;
use App\Drivers\Values\PinnedDriver;
use Closure;
use Illuminate\Database\DatabaseManager;
use PhpOption\Option;
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
        private ReplyInboxes $replyInboxes,
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
        $replyInboxId = $this->replyInboxes->replyInboxIdFor($requester);
        $start = fn () => $next($call);

        return $this->locks->hold(
            $request->requestId,
            fn () => $this->databases->connection()->transactionLevel() === 0
                ? $this->startInOwnTransaction($request, $requester, $replyInboxId, $start)
                : $this->startInOpenTransaction($request, $requester, $replyInboxId, $start),
        );
    }

    /**
     * The intent commits before admission, so the refusal finds its record after the rollback; a failure that is no
     * refusal leaves the key free again.
     *
     * @param  Option<string>  $replyInboxId
     * @param  Closure(): mixed  $start
     */
    private function startInOwnTransaction(
        StartRequest $request,
        ActorIdentity $requester,
        Option $replyInboxId,
        Closure $start,
    ): mixed {
        $intent = StartRecord::accept($request, $this->pinOf($request), $requester, $replyInboxId);

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
     * @param  Option<string>  $replyInboxId
     * @param  Closure(): mixed  $start
     */
    private function startInOpenTransaction(
        StartRequest $request,
        ActorIdentity $requester,
        Option $replyInboxId,
        Closure $start,
    ): mixed {
        try {
            return $start();
        } catch (StartRefusal $refusal) {
            $pin = $this->pinOf($request);
            StartRecord::accept($request, $pin, $requester, $replyInboxId)->refuse($refusal);
            $this->heldRefusals->hold($request, $pin, $requester, $replyInboxId, $refusal);

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
