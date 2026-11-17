<?php

declare(strict_types=1);

namespace App\Core\Hooks\Inspection;

use App\Core\Hooks\Enums\AnswerType;
use App\Core\Hooks\Models\HookCall;
use App\Core\Hooks\Storage\WalkStep;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * @method static static from(HookCall $call)
 *
 * The last answered call of a stack: its exact reply and only the states its walk asked, top first.
 */
final class InspectedCall extends Data
{
    use OptionalOrMissing;

    /**
     * @param  list<WalkStep>  $steps
     */
    public function __construct(
        public readonly string $hookId,
        public readonly AnswerType $answer,
        public readonly string $stdout,
        #[DataCollectionOf(WalkStep::class)]
        public readonly array $steps,
    ) {}

    public static function fromHookCall(HookCall $call): self
    {
        return new self($call->event_id, $call->answer->type, $call->answer->stdout, $call->steps->steps);
    }
}
