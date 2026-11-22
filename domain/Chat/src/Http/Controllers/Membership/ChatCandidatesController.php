<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Membership;

use App\Contracts\Actors\ActorLabels;
use App\Contracts\Actors\CurrentActor;
use App\Support\ActorIdentity;
use App\Support\AgentDrivers;
use Domain\Chat\Data\ChatInput;
use Domain\Chat\Data\SpeakerData;
use Domain\Chat\Support\AuthorizedConversations;
use Domain\Chat\Support\ChatAdmissionPolicy;

/**
 * The users and agents the asker may add to a chat it is in: only eligible ones of the chat's environment, through the same
 * policy the add itself checks, each agent with the driver it runs; a member who may not invite sees none.
 */
final readonly class ChatCandidatesController
{
    /**
     * @return array{candidates: list<SpeakerData>}
     */
    public function __invoke(
        ChatInput $input,
        CurrentActor $actors,
        AuthorizedConversations $conversations,
        ChatAdmissionPolicy $policy,
        ActorLabels $labels,
        AgentDrivers $agentDrivers,
    ): array {
        $chat = $conversations->inInbox($input->inboxId);
        $candidates = $policy->candidates(ActorIdentity::of($actors->actor()), $chat);
        $names = $labels->labelsFor($candidates);
        $drivers = $agentDrivers->driversOf($candidates);

        return ['candidates' => array_map(fn (ActorIdentity $candidate) => SpeakerData::from([
            'actor' => "{$candidate->type->value}:{$candidate->id}",
            'label' => $names->nameOf($candidate) ?? $candidate->id,
            'driver' => $drivers["{$candidate->type->value}:{$candidate->id}"] ?? null,
        ]), $candidates)];
    }
}
