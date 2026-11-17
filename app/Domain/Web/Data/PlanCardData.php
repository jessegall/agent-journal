<?php

declare(strict_types=1);

namespace App\Domain\Web\Data;

use App\Domain\Plans\Api\PlanCard;
use App\Domain\Plans\Enums\PlanKind;
use App\Domain\Plans\Enums\PlanState;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One plan card (doc 4, 7.3). The id travels as a decimal string so a bigint keeps its precision.
 *
 * @method static static from(PlanCard|array<string, mixed> $payload)
 * @method static array<int, static> collect(list<PlanCard> $cards)
 */
#[TypeScript]
final class PlanCardData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $title,
        public readonly PlanKind $kind,
        public readonly PlanState $state,
        public readonly bool $focused,
        public readonly int $doneTasks,
        public readonly int $totalTasks,
        public readonly int|Optional $phase = new Optional,
        public readonly AgentLabelData|Optional $agent = new Optional,
    ) {}

    /**
     * The card as the browser gets it; a plan without phases has no phase key, an unassigned plan no agent key.
     */
    public static function fromPlanCard(PlanCard $card): self
    {
        return self::from(array_filter([
            'id' => (string) $card->id,
            'title' => $card->title,
            'kind' => $card->kind,
            'state' => $card->state,
            'focused' => $card->focused,
            'doneTasks' => $card->progress->done,
            'totalTasks' => $card->progress->total,
            'phase' => $card->currentPhase,
            'agent' => AgentLabelData::optionalOrMissing($card->agentName === null ? null : ['name' => $card->agentName]),
        ], fn (mixed $value) => $value !== null));
    }
}
