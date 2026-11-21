<?php

declare(strict_types=1);

namespace Domain\Plans\Mcp;

use App\Mcp\Contracts\Continuations;
use App\Mcp\Contracts\TextFields;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\Continuation;
use App\Mcp\Support\ToolArguments;
use App\Reads\Enums\ReadView;
use Domain\Plans\Api\PlanDetails;
use Domain\Plans\Api\PlanPhaseTasks;
use Domain\Plans\Contracts\PlanDetailsResolver;

/**
 * Presents the same plan details for the tool and resource.
 */
final readonly class PlanReadResult
{
    public const string TOOL = 'plans_read';

    private const int PHASES_PER_RESULT = 2;

    private const int INLINE_TEXT_BYTES = 600;

    public function __construct(
        private PlanDetailsResolver $plans,
        private Continuations $continuations,
        private TextFields $fields,
    ) {}

    public function read(string $planId, ToolArguments $arguments): ToolResult
    {
        $cursor = $arguments->continuation();

        $position = $cursor === null
            ? $this->first($planId, $arguments->enumOr('view', ReadView::Summary))
            : $this->continuations->open($cursor, self::TOOL, $planId);

        $view = ReadView::from($position->filters['view']);
        $isTextContinuation = isset($position->filters['text_digest']);
        $plan = $this->plans->plan($planId, $view, $isTextContinuation ? 0 : $position->offset);
        $position->assertCurrentRevision($plan->revision);

        $text = $this->text($plan);

        if ($isTextContinuation) {
            return $this->fields->page($this->summary($plan), $text, $position, 'plan_id');
        }

        return $this->phases($plan, $position, $text);
    }

    private function first(string $planId, ReadView $view): Continuation
    {
        return new Continuation(self::TOOL, $planId, ['view' => $view->value, 'phase_offset' => 0], 0);
    }

    /**
     * @param  array<string, string>  $text
     */
    private function phases(PlanDetails $plan, Continuation $position, array $text): ToolResult
    {
        $phases = $position->offset === 0 ? $plan->phases : array_values(array_filter(
            $plan->phases,
            fn (PlanPhaseTasks $phase): bool => $phase->taskIds !== [],
        ));

        $phaseOffset = (int) $position->filters['phase_offset'];
        $page = array_slice($phases, $phaseOffset, self::PHASES_PER_RESULT);
        $next = $this->nextPhases($plan, $position, $phaseOffset + count($page), count($phases));
        $inline = strlen(json_encode($text, JSON_THROW_ON_ERROR)) <= self::INLINE_TEXT_BYTES;

        if ($next === null && ! $inline) {
            $next = $this->fields->start(new Continuation(
                self::TOOL,
                $plan->id,
                ['view' => ReadView::Context->value],
                1,
                revision: $plan->revision,
            ), $text);
        }

        return ToolResult::ok([
            ...$this->summary($plan),
            'phases' => array_map($this->phase(...), $page),
            ...($inline && $position->offset === 0 && $phaseOffset === 0 ? $text : []),
        ], $next === null ? [] : [$this->continuations->link($next, 'plan_id')]);
    }

    private function nextPhases(
        PlanDetails $plan,
        Continuation $position,
        int $phase,
        int $count,
    ): Continuation|null {
        $hasMorePhases = $phase < $count;
        $taskOffset = $hasMorePhases ? $position->offset : $plan->nextTaskOffset;

        if ($taskOffset === null) {
            return null;
        }

        return new Continuation(
            self::TOOL,
            $plan->id,
            [...$position->filters, 'phase_offset' => $hasMorePhases ? $phase : 0],
            $taskOffset,
            revision: $plan->revision,
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function summary(PlanDetails $plan): array
    {
        return [
            'plan_id' => $plan->id,
            'number' => $plan->number,
            'title' => $plan->title,
            'type' => $plan->type->value,
            'state' => $plan->state->value,
            'revision' => $plan->revision,
            'creator' => ['type' => $plan->creatorType->value, 'id' => $plan->creatorId],
            'progress' => [
                'done' => $plan->progress->done,
                'started' => $plan->progress->started,
                'blocked' => $plan->progress->blocked,
                'total' => $plan->progress->total,
            ],
            'current_phase' => $plan->currentPhase,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function phase(PlanPhaseTasks $phase): array
    {
        return [
            'phase_id' => $phase->id,
            'number' => $phase->number,
            'title' => $phase->title,
            'revision' => $phase->revision,
            'task_ids' => $phase->taskIds,
        ];
    }

    /**
     * @return array<string, string>
     */
    private function text(PlanDetails $plan): array
    {
        return array_filter([
            'brief' => $plan->brief,
            'finish_note' => $plan->finishNote,
            'cancel_reason' => $plan->cancelReason,
        ], is_string(...));
    }
}
