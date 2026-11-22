<?php

declare(strict_types=1);

namespace App\Hooks\Support;

use App\Actors\Contracts\ActorAttention;
use App\Actors\Support\ActorIdentity;
use App\Actors\Support\AttentionOrigin;
use App\Agents\Values\StackTarget;
use App\Hooks\Inputs\Contracts\HookInput;
use App\Hooks\Models\PendingAgentMessage;
use App\Hooks\Stack\HookAnswer;

/**
 * Keeps authorized event context and idle hook messages, and hands them over in the next eligible hook.
 */
final readonly class AgentMessageDelivery
{
    public function __construct(private ActorAttention $attention) {}

    public function deliver(StackTarget $target, HookInput $input, HookAnswer $answer): HookAnswer
    {
        if ($answer->messages !== [] && $input->leavesAgentIdle($answer->decision->answerType())) {
            $this->keepAndWake($target, $input, $answer->messages);

            return $answer;
        }

        return $answer->withRemindersFirst($this->takeAllFor($target->actorIdentity()));
    }

    /**
     * @param  list<string>  $messages
     */
    private function keepAndWake(StackTarget $target, HookInput $input, array $messages): void
    {
        $agent = $target->actorIdentity();
        $origin = AttentionOrigin::agentMessages($input->identity()->hookId);

        PendingAgentMessage::createAll(array_map(
            fn (string $text) => PendingAgentMessage::unsaved($agent, $origin, [$text], requestsAttention: true),
            $messages,
        ));

        $this->attention->request($agent, $origin);
    }

    /**
     * The texts waiting for the agent, oldest first, removed as they are handed over.
     *
     * @return list<string>
     */
    public function takeAllFor(ActorIdentity $agent): array
    {
        $messages = PendingAgentMessage::query()
            ->ownedBy($agent)
            ->orderBy('created_at')
            ->orderBy('id')
            ->lockForUpdate()
            ->limit(PendingAgentMessage::DELIVERY_LIMIT)
            ->get();

        PendingAgentMessage::query()->ownedBy($agent)->whereKey($messages->modelKeys())->delete();

        return array_values($messages->flatMap(fn (PendingAgentMessage $message) => $message->lines)->all());
    }
}
