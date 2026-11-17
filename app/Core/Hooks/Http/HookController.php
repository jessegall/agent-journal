<?php

declare(strict_types=1);

namespace App\Core\Hooks\Http;

use App\Core\Agents\LaunchSessions;
use App\Core\Hooks\AgentStateMachine;
use App\Core\Hooks\Exceptions\CommandFactsMissing;
use App\Core\Hooks\Exceptions\HookDigestChanged;
use App\Core\Hooks\Exceptions\HookIdentityExpired;
use App\Core\Hooks\Exceptions\StackLockTimedOut;
use App\Core\Hooks\Exceptions\UnreadablePayload;
use App\Core\Hooks\Exceptions\UnsupportedHook;
use App\Core\Hooks\Inputs\HookInput;
use App\Core\Hooks\OperationDeadline;
use App\Core\Hooks\Programs\HookPayload;
use App\Core\Hooks\Programs\ProgramAdapters;
use App\Core\Hooks\StackAccess;
use Closure;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Answers one native hook call: the adapter reads the payload, shell commands included, before the state machine
 * takes the stack lock, and the reply goes back to the host exactly as it was recorded.
 */
final readonly class HookController
{
    public function __construct(
        private ProgramAdapters $adapters,
        private OperationDeadline $deadline,
        private LaunchSessions $sessions,
    ) {}

    /**
     * The stack access and the machine are asked for per call: a controller lives on its route across requests,
     * so anything that holds the calling agent must not be kept on it.
     */
    public function __invoke(HookRequest $request, StackAccess $access, AgentStateMachine $machine): JsonResponse
    {
        $adapter = $this->adapters->for($request->program());

        try {
            $payload = $request->payload();
            $call = $adapter->callFor($payload, $access->hookIdentity());
            $this->mapProgramSession($payload, $access);
            $reply = $call->replyWith(fn (HookInput $input, Closure $render) => $machine->answer($input, $adapter->capabilities(), $this->deadline, $render));
        } catch (UnsupportedHook|UnreadablePayload $refused) {
            return $this->failure($refused->getMessage(), Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (HookIdentityExpired|HookDigestChanged $conflict) {
            return $this->failure($conflict->getMessage(), Response::HTTP_CONFLICT);
        } catch (CommandFactsMissing|StackLockTimedOut $unavailable) {
            return $this->failure($unavailable->getMessage(), Response::HTTP_SERVICE_UNAVAILABLE);
        }

        return new JsonResponse(HookResponse::fromProgramReply($reply)->toArray());
    }

    /**
     * A session start, also after a clear, a resume or a compaction, records the program's own session id on the
     * same journal session.
     */
    private function mapProgramSession(HookPayload $payload, StackAccess $access): void
    {
        if ($payload->isSessionStart()) {
            $this->sessions->mapProgramSessionFor($access->target()->sessionId, $payload->sessionId);
        }
    }

    private function failure(string $message, int $status): JsonResponse
    {
        return new JsonResponse(HookFailure::from(['message' => $message])->toArray(), $status);
    }
}
