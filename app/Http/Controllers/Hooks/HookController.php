<?php

declare(strict_types=1);

namespace App\Http\Controllers\Hooks;

use App\Access\Exceptions\StackLockTimedOut;
use App\Actors\Contracts\AgentTexts;
use App\Agents\Drivers\Contracts\DriverAdapters;
use App\Agents\Drivers\Hooks\DriverReplies;
use App\Agents\Exceptions\HookProtocolUnknown;
use App\Agents\Exceptions\UnreadablePayload;
use App\Api\Hooks\AgentStateMachine;
use App\Exceptions\ConversationIncompatible;
use App\Exceptions\UnsupportedHook;
use App\Hooks\Exceptions\HookDigestChanged;
use App\Hooks\Exceptions\StaleProcessGeneration;
use App\Hooks\HookFailure;
use App\Hooks\HookResponse;
use App\Hooks\NativeTurnRecords;
use App\Http\Requests\Hooks\HookRequest;
use App\Stacks\Exceptions\HookIdentityExpired;
use App\Stacks\Exceptions\IncomingWorkFailed;
use App\Stacks\StackAccess;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\StackOperationDeadline;
use App\Values\AgentText;
use Closure;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Answers one native hook call: the adapter reads the payload, shell commands included, before the state machine
 * takes the stack lock, and the reply goes back to the host exactly as it was recorded.
 */
final readonly class HookController
{
    public function __construct(
        private DriverAdapters $adapters,
        private StackOperationDeadline $deadline,
        private NativeTurnRecords $turns,
        private AgentTexts $texts,
    ) {}

    /**
     * The stack access and the machine are asked for per call: a controller lives on its route across requests,
     * so anything that holds the calling agent must not be kept on it.
     */
    public function __invoke(HookRequest $request, StackAccess $access, AgentStateMachine $machine): JsonResponse
    {
        // A hook address names a protocol no adapter reads: there is no such endpoint.
        if (! $this->adapters->supports($request->driver())) {
            throw new NotFoundHttpException(HookProtocolUnknown::for($request->driver())->getMessage());
        }

        $adapter = $this->adapters->for($request->driver());

        try {
            $hookInput = $request->payload();

            if ($hookInput->isFromNativeChild() || $hookInput->callsAnyOf($adapter->nativeChildTools())) {
                $refusal = DriverReplies::denyTool(
                    $this->texts->render(AgentText::of('core.drivers.own_subagents')),
                    [],
                );

                return new JsonResponse(HookResponse::fromDriverReply($refusal));
            }

            $sessionId = $access->target()->sessionId;
            $generation = $request->processGeneration();
            $this->turns->checkGeneration($sessionId, $generation);
            $this->turns->acknowledgeWake($sessionId);

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

        return new JsonResponse(HookResponse::fromDriverReply($reply));
    }

    private function failure(string $message, int $status): JsonResponse
    {
        return new JsonResponse(HookFailure::from(['message' => $message]), $status);
    }
}
