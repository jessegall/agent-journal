<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Loaders;

use App\Actors\Contracts\ActorLabels;
use App\Inboxes\Contracts\InboxEligibility;
use App\Models\Access\User;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorReference;
use Domain\Chat\Data\ChatCandidatesData;
use Domain\Chat\Data\ChatInput;
use Domain\Chat\Support\ChatDirectory;

/**
 * The users the viewer may add to a group chat it manages: those who may be invited and are not in it yet, at most
 * CANDIDATE_LIMIT of them.
 */
final readonly class ChatCandidatesLoader
{
    public const int CANDIDATE_LIMIT = 50;

    public function __construct(
        private ChatDirectory $chats,
        private InboxEligibility $eligibility,
        private ActorLabels $labels,
    ) {}

    public function __invoke(ChatInput $input): ChatCandidatesData
    {
        $this->chats->assertManages($input->inboxId);

        $members = array_map(
            fn (ActorReference $member) => $member->id,
            InboxMember::resolveAttachedTo([$input->inboxId], User::class),
        );

        $candidates = array_values(array_map(
            fn (string $userId) => ActorReference::ofClass(User::class, $userId),
            array_diff($this->eligibility->invitableUserIds(null, self::CANDIDATE_LIMIT), $members),
        ));

        $names = $this->labels->labelsFor($candidates);

        return ChatCandidatesData::from(['candidates' => array_map(fn (ActorReference $candidate) => [
            'actor' => $candidate->text(),
            'label' => $names->nameOf($candidate) ?? $candidate->id,
            'driver' => null,
        ], $candidates)]);
    }
}
