<?php

declare(strict_types=1);

namespace App\Processes\Readers;

use App\Actors\Contracts\CurrentActor;
use App\Asks\AskRecords as VisibleAsks;
use App\Asks\Contracts\AskReader as AskReaderContract;
use App\Asks\Data\AskCard;
use App\Asks\Data\AskDetail;
use App\Asks\Data\AskInbox;
use App\Asks\Enums\AskResult;
use App\Assignments\Contracts\AssignmentResolver;
use App\Models\Asks\Ask;
use App\Models\Asks\AskHop;
use App\Support\AssigneeIdentity;
use App\Support\Assignment;
use App\Values\AskReference;

final readonly class AskReader implements AskReaderContract
{
    private const int PAGE_SIZE = 50;

    public function __construct(
        private CurrentActor $actors,
        private VisibleAsks $asks,
        private AssignmentResolver $assignments,
    ) {}

    public function card(AskReference $reference): AskCard
    {
        return $this->cards([$this->asks->read($reference)])[0];
    }

    public function detail(AskReference $reference): AskDetail
    {
        $ask = $this->asks->read($reference);
        $card = $this->cards([$ask])[0];
        $result = AskResult::of($ask);

        return new AskDetail($card, $ask->version, $result, $result->label());
    }

    public function inbox(AskReference|null $before = null): AskInbox
    {
        $query = $this->asks->visible()->orderByDesc('id');

        if ($before !== null) {
            $query->where('id', '<', $before->id);
        }

        $asks = $query->limit(self::PAGE_SIZE + 1)->get();
        $page = $asks->take(self::PAGE_SIZE);

        return AskInbox::from([
            'cards' => $this->cards(array_values($page->all())),
            'before' => $asks->count() > self::PAGE_SIZE ? $page->last()->id : null,
        ]);
    }

    /**
     * @param  list<Ask>  $asks
     * @return list<AskCard>
     */
    private function cards(array $asks): array
    {
        if ($asks === []) {
            return [];
        }

        $actor = $this->actors->actor();
        $holder = AssigneeIdentity::ofActorReference($actor);
        $records = array_map(fn (Ask $ask) => $ask->assignmentIdentity(), $asks);
        $assignments = $this->assignments->assignmentsFor($records);
        $replies = AskHop::resolveRepliesTo(array_map(fn (Ask $ask) => $ask->id, $asks));

        return array_map(function (Ask $ask) use ($assignments, $holder, $replies): AskCard {
            $assigned = $assignments->forRecord($ask->assignmentIdentity())
                ->map(fn (Assignment $assignment) => $assignment->holder());

            $current = $assigned->getOrElse(null);

            return AskCard::from([
                'id' => $ask->id,
                'type' => $ask->type_key->key,
                'body' => $ask->body,
                'isOpen' => $ask->open,
                'isObligation' => $current?->isSameAs($holder) === true,
                'reply' => $replies[$ask->id] ?? null,
                'holderType' => $current?->type,
                'holderId' => $current?->id,
            ]);
        }, $asks);
    }
}
