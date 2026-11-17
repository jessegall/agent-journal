<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Http;

use App\Domain\Hooks\AgentStateMachine;
use App\Domain\Hooks\HookDigestChanged;
use App\Domain\Hooks\HookIdentityExpired;
use App\Domain\Hooks\Inputs\CommandFactsMissing;
use App\Domain\Hooks\Inputs\HookInput;
use App\Domain\Hooks\OperationDeadline;
use App\Domain\Hooks\Programs\ProgramAdapters;
use App\Domain\Hooks\Programs\UnreadablePayload;
use App\Domain\Hooks\Programs\UnsupportedHook;
use App\Domain\Hooks\StackAccess;
use App\Domain\Hooks\StackLockTimedOut;
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
    ) {}

    /**
     * The stack access and the machine are asked for per call: a controller lives on its route across requests,
     * so anything that holds the calling agent must not be kept on it.
     */
    public function __invoke(HookRequest $request, StackAccess $access, AgentStateMachine $machine): JsonResponse
    {
        $adapter = $this->adapters->for($request->program());

        try {
            $call = $adapter->callFor($request->payload(), $access->hookIdentity());
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

    private function failure(string $message, int $status): JsonResponse
    {
        return new JsonResponse(HookFailure::from(['message' => $message])->toArray(), $status);
    }
}
