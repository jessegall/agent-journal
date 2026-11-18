<?php

declare(strict_types=1);

namespace App\Http\Controllers\Hooks;

use App\Agents\Exceptions\ConversationIncompatible;
use App\Agents\Exceptions\StaleProcessGeneration;
use App\Agents\Support\NativeTurns;
use App\Bus\Exceptions\StackLockTimedOut;
use App\Bus\Support\OperationDeadline;
use App\Hooks\Contracts\HookInput;
use App\Hooks\Exceptions\HookDigestChanged;
use App\Hooks\Exceptions\HookIdentityExpired;
use App\Hooks\Exceptions\ShellParserMissing;
use App\Hooks\Exceptions\UnreadablePayload;
use App\Hooks\Exceptions\UnsupportedHook;
use App\Hooks\Programs\ProgramAdapters;
use App\Hooks\Programs\ProgramReplies;
use App\Hooks\Stack\AgentStateMachine;
use App\Hooks\Support\StackAccess;
use App\Http\Requests\Hooks\HookRequest;
use App\Http\Support\Hooks\HookFailure;
use App\Http\Support\Hooks\HookResponse;
use Closure;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Answers one native hook call: the adapter reads the payload, shell commands included, before the state machine
 * takes the stack lock, and the reply goes back to the host exactly as it was recorded.
 */
final readonly class HookController
{
    private const string NATIVE_CHILD_REFUSAL = 'A program\'s own subagents never run here (rule 36): start a journal helper or worker instead.';

    public function __construct(
        private ProgramAdapters $adapters,
        private OperationDeadline $deadline,
        private NativeTurns $turns,
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

            if ($payload->isFromNativeChild() || $payload->callsAnyOf($request->program()->nativeChildTools())) {
                return new JsonResponse(HookResponse::fromProgramReply(ProgramReplies::denyTool(self::NATIVE_CHILD_REFUSAL, []))->toArray());
            }

            $this->turns->checkGeneration($access->target()->sessionId, $request->processGeneration());

            if ($payload->hookEventName === 'UserPromptSubmit') {
                $this->turns->recordPrompt($access->target()->sessionId, $request->processGeneration(), $payload->nativePromptId());
            }

            $call = $adapter->callFor($payload, $access->hookIdentity());
            $reply = $call->replyWith(fn (HookInput $input, Closure $render) => $machine->answer($input, $adapter->capabilities(), $this->deadline, $render));
        } catch (UnsupportedHook|UnreadablePayload $refused) {
            return $this->failure($refused->getMessage(), Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (HookIdentityExpired|HookDigestChanged|StaleProcessGeneration|ConversationIncompatible $conflict) {
            return $this->failure($conflict->getMessage(), Response::HTTP_CONFLICT);
        } catch (ShellParserMissing|StackLockTimedOut $unavailable) {
            return $this->failure($unavailable->getMessage(), Response::HTTP_SERVICE_UNAVAILABLE);
        }

        return new JsonResponse(HookResponse::fromProgramReply($reply)->toArray());
    }

    private function failure(string $message, int $status): JsonResponse
    {
        return new JsonResponse(HookFailure::from(['message' => $message])->toArray(), $status);
    }
}
