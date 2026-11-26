<?php

declare(strict_types=1);

namespace App\Support\Inspection;

use App\Engine\Enums\FrameLiveness;
use App\Stacks\Frames\Frame;
use App\Stacks\References\SubjectReference;
use App\Stacks\StateLoading\StateValues;
use Spatie\LaravelData\Data;

/**
 * One frame as the inspector shows it, with the values its state saves; a frame about no subject shows a null subject.
 */
final class InspectedFrame extends Data
{
    /**
     * @param  array<string, mixed>  $values
     */
    public function __construct(
        public readonly string $id,
        public readonly string $typeKey,
        public readonly InspectedSubject|null $subject,
        public readonly bool $isBottom,
        public readonly FrameLiveness $liveness,
        public readonly bool $isEffectiveTop,
        public readonly array $values,
    ) {}

    /**
     * The frame as stored, with whether a hook asks it and whether it is the stack's highest live frame.
     */
    public static function fromFrame(Frame $frame, Frame $effectiveTop): self
    {
        $subject = $frame->reference->subject;

        return new self(
            $frame->id,
            $frame->typeKey(),
            $subject instanceof SubjectReference ? new InspectedSubject($subject->id, $subject->runNumber) : null,
            $frame->isBottom(),
            FrameLiveness::of($frame),
            $frame->id === $effectiveTop->id,
            StateValues::of($frame->state),
        );
    }

    /**
     * The saved list of text of this name, such as the skills a reading state still waits for; none when it saves no
     * such list.
     *
     * @return list<string>
     */
    public function textList(string $name): array
    {
        $list = $this->values[$name] ?? [];

        if (is_array($list)) {
            return array_values(array_filter($list, is_string(...)));
        }

        return [];
    }
}
