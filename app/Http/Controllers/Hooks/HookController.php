<?php

declare(strict_types=1);

namespace App\Http\Controllers\Hooks;

use App\Agents\Exceptions\ConversationIncompatible;
use App\Agents\Exceptions\StaleProcessGeneration;
use App\Agents\Support\NativeTurns;
use App\Bus\Exceptions\StackLockTimedOut;
use App\Bus\Support\OperationDeadline;
use App\Hooks\Calls\AgentStateMachine;
use App\Hooks\Drivers\Contracts\DriverAdapters;
use App\Hooks\Drivers\DriverReplies;
use App\Hooks\Exceptions\HookDigestChanged;
use App\Hooks\Exceptions\HookIdentityExpired;
use App\Hooks\Exceptions\IncomingWorkFailed;
use App\Hooks\Exceptions\UnreadablePayload;
use App\Hooks\Exceptions\UnsupportedHook;
use App\Hooks\Inputs\Contracts\HookInput;
use App\Hooks\Support\StackAccess;
use App\Http\Requests\Hooks\HookRequest;
use App\Http\Support\Hooks\HookFailure;
use App\Http\Support\Hooks\HookResponse;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Answers one native hook call: the adapter reads the payload, shell commands included, before the state machine
 * takes the stack lock, and the reply goes back to the host exactly as it was recorded.
 */
final readonly class HookController
{
    private const string NATIVE_CHILD_REFUSAL = "A program's own subagents never run here (rule 36): start a journal helper or worker instead.";

    public function __construct(
        private DriverAdapters $adapters,
        private OperationDeadline $deadline,
        private NativeTurns $turns,
    ) {}

    /**
     * The stack access and the machine are asked for per call: a controller lives on its route across requests,
     * so anything that holds the calling agent must not be kept on it.
     */
    public function __invoke(HookRequest $request, StackAccess $access, AgentStateMachine $machine): JsonResponse
    {
        $adapter = $this->adapters->for($request->driver());

        try {
            $hookInput = $request->payload();

            if ($hookInput->isFromNativeChild() || $hookInput->callsAnyOf($request->driver()->nativeChildTools())) {
                $refusal = DriverReplies::denyTool(self::NATIVE_CHILD_REFUSAL, []);

                return new JsonResponse(HookResponse::fromDriverReply($refusal)->toArray());
            }

            $sessionId = $access->target()->sessionId;
            $generation = $request->processGeneration();
            $this->turns->checkGeneration($sessionId, $generation);
            $this->turns->acknowledgeWake($sessionId, CarbonImmutable::now());

            $call = $adapter->callFor($hookInput, $access->hookIdentity());
            $capabilities = $adapter->capabilities();

            $answer = function (HookInput $input, Closure $render) use (
                $sessionId,
                $generation,
                $machine,
                $capabilities,
            ) {
                $input->recordTurn($this->turns, $sessionId, $generation);

                return $machine->answer($input, $capabilities, $this->deadline, $render);
            };

            $reply = $call->replyWith($answer);
        } catch (UnsupportedHook|UnreadablePayload $refused) {
            return $this->failure($refused->getMessage(), Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (HookIdentityExpired|HookDigestChanged|StaleProcessGeneration|ConversationIncompatible $conflict) {
            return $this->failure($conflict->getMessage(), Response::HTTP_CONFLICT);
        } catch (StackLockTimedOut|IncomingWorkFailed $unavailable) {
            return $this->failure($unavailable->getMessage(), Response::HTTP_SERVICE_UNAVAILABLE);
        }

        return new JsonResponse(HookResponse::fromDriverReply($reply)->toArray());
    }

    private function failure(string $message, int $status): JsonResponse
    {
        return new JsonResponse(HookFailure::from(['message' => $message])->toArray(), $status);
    }
}
