<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Membership;

use App\Actors\Contracts\ActorLabels;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use Domain\Chat\Data\ChatInput;
use Domain\Chat\Data\SpeakerData;
use Domain\Chat\Support\AuthorizedConversations;
use Domain\Chat\Support\ChatAdmissionPolicy;
use Illuminate\Http\JsonResponse;

/**
 * The users the asker may add to a chat it is in: only eligible users of the chat's environment, through the same
 * policy the add itself checks; a member who may not invite sees none.
 */
final readonly class ChatCandidatesController
{
    public function __invoke(
        ChatInput $input,
        CurrentActor $actors,
        AuthorizedConversations $conversations,
        ChatAdmissionPolicy $policy,
        ActorLabels $labels,
    ): JsonResponse {
        $chat = $conversations->inInbox($input->inboxId);
        $users = array_map(
            fn (string $userId) => new ActorIdentity(ActorType::User, $userId),
            $policy->candidates(ActorIdentity::of($actors->actor()), $chat),
        );
        $names = $labels->labelsFor($users);

        return new JsonResponse(['candidates' => array_map(fn (ActorIdentity $user) => SpeakerData::from([
            'actor' => "user:{$user->id}",
            'label' => $names->nameOf($user) ?? $user->id,
            'driver' => null,
        ]), $users)]);
    }
}
