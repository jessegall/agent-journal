<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Membership;

use App\Contracts\Actors\ActorLabels;
use App\Contracts\Inboxes\InboxEligibility;
use App\Enums\ActorType;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorIdentity;
use Domain\Chat\Data\ChatInput;
use Domain\Chat\Data\ParticipantData;
use Domain\Chat\Support\ChatInboxes;

/**
 * The users the viewer may add to a group chat: those who may be invited and are not in it yet.
 */
final readonly class ChatCandidatesController
{
    private const int CANDIDATE_LIMIT = 50;

    /**
     * @return array{candidates: list<ParticipantData>}
     */
    public function __invoke(
        ChatInput $input,
        ChatInboxes $chats,
        InboxEligibility $eligibility,
        ActorLabels $labels,
    ): array {
        $chats->assertManages($input->inboxId);
        $members = array_map(
            fn (ActorIdentity $member) => $member->id,
            InboxMember::attachedTo([$input->inboxId], ActorType::User),
        );
        $candidates = array_values(array_map(
            fn (string $userId) => new ActorIdentity(ActorType::User, $userId),
            array_diff($eligibility->invitableUserIds(null, self::CANDIDATE_LIMIT), $members),
        ));
        $names = $labels->labelsFor($candidates);

        return ['candidates' => array_map(fn (ActorIdentity $candidate) => ParticipantData::from([
            'actor' => $candidate->text(),
            'label' => $names->nameOf($candidate) ?? $candidate->id,
            'driver' => null,
        ]), $candidates)];
    }
}
