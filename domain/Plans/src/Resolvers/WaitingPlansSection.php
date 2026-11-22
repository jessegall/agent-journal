<?php

declare(strict_types=1);

namespace Domain\Plans\Resolvers;

use App\Agents\Contracts\SessionResolver;
use App\Assignments\Support\AssignmentData;
use App\Ui\Contracts\SectionResolver;
use App\Ui\Declarations\SlotContext;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\LayoutPartData;
use App\Ui\Layout\LayoutRowData;
use Domain\Plans\Api\PlanFilters;
use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Data\PlanCardData;
use Domain\Plans\Enums\PlanStateGroup;

/**
 * The plans waiting for review, in Chat's dock, as a read-only list layout: each plan's number and title, its state,
 * who holds it and how far its tasks are, opening its own page; with none waiting the section holds nothing and takes
 * no space.
 */
final readonly class WaitingPlansSection implements SectionResolver
{
    public function __construct(
        private SessionResolver $sessions,
        private PlanResolver $records,
    ) {}

    public function read(SlotContext $context): DeclaredLayoutData
    {
        $this->sessions->requireActive((string) $context->id);
        $filters = new PlanFilters(states: PlanStateGroup::Waiting->states());
        $cards = PlanCardData::collect($this->records->list($filters)->cards);

        if ($cards === []) {
            return DeclaredLayoutData::of(LayoutPartData::box('waiting', 'stack'));
        }

        return DeclaredLayoutData::of(LayoutPartData::box(
            'waiting',
            'stack',
            LayoutPartData::collection('plans', 'list', array_map(fn (PlanCardData $card) => new LayoutRowData(
                $card->id,
                "plan {$card->number} · {$card->title}",
                $card->state->value,
                detail: implode(' · ', array_filter([
                    $card->holder instanceof AssignmentData ? "held by {$card->holder->name}" : null,
                    "{$card->finishedTasks} of {$card->totalTasks} tasks",
                ])),
                href: route('plans.plan', ['plan' => $card->id], false),
            ), $cards)),
        ));
    }
}
