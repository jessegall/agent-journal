<?php

declare(strict_types=1);

namespace App\Support\Stack;

use App\Contracts\Actors\AgentTexts;
use App\Contracts\Bus\Command;
use App\Contracts\Events\Event;
use App\Declarations\StateMethods;
use App\Enums\AnswerType;
use App\Exceptions\BottomStateCannotFinish;
use App\Exceptions\InvalidHookAnswer;
use App\Exceptions\MissingBottomState;
use App\Exceptions\StackTooDeep;
use App\Support\Decisions\Decision;
use App\Support\Decisions\MessageLine;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\References\StateReference;
use App\Support\Stack\Contracts\StateFactory;
use App\Support\Stack\Frames\Frame;
use App\Support\Storage\FrameRecords;
use App\Values\AgentText;
use App\Values\StackTarget;
use PhpOption\None;
use PhpOption\Option;

/**
 * The immutable frame order of an agent's stack, with hook decisions collected from its live snapshot.
 */
final readonly class AgentStack
{
    /**
     * The most frames one stack may hold, ready included.
     */
    public const int DEPTH_LIMIT = 100;

    /**
     * @param  list<Frame>  $frames  bottom first
     */
    public function __construct(
        private array $frames,
        private StateFactory $factory,
        private StackTarget $target,
        private StateMethodSelector $selector = new StateMethodSelector(new StateMethods()),
    ) {}

    /**
     * Asks the live states that answer the hook from the top down: the first deny answers and nothing below it is
     * asked; otherwise the highest rewrite counts, and the hook is allowed when every state passed.
     */
    public function answer(HookInput $input, AgentTexts $texts): HookAnswer
    {
        $bottom = $this->frames[0] ?? null;

        if ($bottom === null || ! $bottom->isBottom() || ! $bottom->isLive()) {
            throw MissingBottomState::for($input->methodName());
        }

        $selected = $this->selector->forHook($this, $input);

        if ($selected === []) {
            throw MissingBottomState::for($input->methodName());
        }

        $before = $this->snapshot();
        $steps = [];
        $context = [];
        $messages = [];
        $effects = [];
        $stack = $this;
        $highest = null;

        foreach ($selected as $handler) {
            $answered = StateAnswer::of(
                $handler->frame->answer($input),
                $handler->method->stateClass,
                $input->methodName(),
            );

            $decision = $answered->decision;
            $steps[] = $handler->walkStep($decision, count($answered->lines), $texts);
            $effects = [...$effects, ...$answered->effects];

            foreach ($answered->pushes as $push) {
                $stack = $stack->withStateOnTop($push);
            }

            foreach ($answered->lines as $line) {
                $words = $texts->render($line->text);
                $context[] = $words;

                if ($line instanceof MessageLine) {
                    $messages[] = $words;
                }
            }

            if ($decision->answerType() === AnswerType::Delegate) {
                continue;
            }

            if (! $input->accepts($decision->answerType())) {
                throw InvalidHookAnswer::for($input->methodName(), $decision->answerType()->value);
            }

            if ($decision->answerType() === AnswerType::Deny) {
                return new HookAnswer($decision, $context, $steps, $stack, $messages, [
                    ...$effects,
                    ...$stack->lifecycleEffectsSince($before),
                ]);
            }

            $highest ??= $decision;
        }

        return new HookAnswer($highest ?? Decision::allow(), $context, $steps, $stack, $messages, [
            ...$effects,
            ...$stack->lifecycleEffectsSince($before),
        ]);
    }

    /**
     * The instruction of the top live state that has one.
     *
     * @return Option<AgentText>
     */
    public function instruction(): Option
    {
        foreach (array_reverse($this->frames) as $frame) {
            $instruction = $frame->isLive() ? $frame->state->instruction() : None::create();

            if ($instruction->isDefined()) {
                return $instruction;
            }
        }

        return None::create();
    }

    /**
     * Whether a frame for the reference is on the stack as live work, read for the stack's own agent.
     */
    public function holdsLive(StateReference $reference): bool
    {
        foreach ($this->frames as $frame) {
            if ($frame->isFor($reference)) {
                return $frame->isLive();
            }
        }

        return false;
    }

    /**
     * The stack with the live frame of the reference moved to the top with its own values, so its work is the work in
     * hand again; a stack without such a frame, or whose live top it already is, is left as it is.
     */
    public function withLiveFrameLifted(StateReference $reference): self
    {
        $lifted = array_find(
            $this->frames,
            fn (Frame $frame) => ! $frame->isBottom() && $frame->isLive() && $frame->isFor($reference),
        );

        if ($lifted === null || $lifted->id === $this->top()->id) {
            return $this;
        }

        return clone ($this, ['frames' => [
            ...$this->withoutFrame($lifted)->frames,
            $lifted,
        ]]);
    }

    /**
     * The stack with a state put on top, or this stack when a unique state already holds unfinished work for the same
     * reference or the state's type is switched off. A finished frame of a unique state gives way to the new one, so
     * work that comes again starts with values of its own; any other state gets a new frame on every push. Every push
     * passes through here, so a declined push stores nothing.
     */
    public function withStateOnTop(StateReference $reference): self
    {
        foreach ($this->frames as $frame) {
            if (! $frame->keepsOneFrameFor($reference)) {
                continue;
            }

            if ($frame->isBottom() || ! $frame->isFinished()) {
                return $this;
            }

            return $this->withoutFrame($frame)->withStateOnTop($reference);
        }

        if (! $this->factory->isEnabled($reference)) {
            return $this;
        }

        $frame = $this->factory->frameFor($reference);

        if (! $frame->isEnabled()) {
            return $this;
        }

        if (count($this->frames) >= self::DEPTH_LIMIT) {
            throw StackTooDeep::for($this->target->description(), self::DEPTH_LIMIT);
        }

        return clone ($this, ['frames' => [
            ...$this->frames,
            $frame,
        ]]);
    }

    /**
     * The stack without a frame whose work is done; a frame that is already gone changes nothing.
     */
    public function withoutFrame(Frame $frame): self
    {
        if ($frame->isBottom()) {
            throw BottomStateCannotFinish::for($frame->typeKey());
        }

        $kept = array_filter($this->frames, fn (Frame $candidate) => $candidate->id !== $frame->id);

        return clone ($this, ['frames' => array_values($kept)]);
    }

    /**
     * The stack without the finished or switched-off frames exposed at its physical top, down to the first live one.
     * A frame that is not live under a live one is only passed over by a walk, never removed: skipping is not popping.
     */
    public function withoutExposedInactive(): self
    {
        $frames = $this->frames;

        foreach (array_reverse($this->frames) as $frame) {
            if ($frame->isBottom() || $frame->isLive()) {
                break;
            }

            array_pop($frames);
        }

        return clone ($this, ['frames' => $frames]);
    }

    /**
     * The stack after a frame's explicit pop: without the frame, then without the inactive frames that pop exposed.
     */
    public function poppedOf(Frame $frame): self
    {
        return $this->withoutFrame($frame)->withoutExposedInactive();
    }

    /**
     * The commands and events the states answer the moments of the change since the snapshot with: exits, entries,
     * then the resume.
     *
     * @return list<Command<mixed>|Event>
     */
    public function lifecycleEffectsSince(StackSnapshot $before): array
    {
        $effects = array_map(fn (FrameMoment $moment) => $moment->effects(), $before->momentsOf($this));

        return array_merge([], ...$effects);
    }

    /**
     * Which frames the stack holds and which are live now, to read the lifecycle moments of a change against.
     */
    public function snapshot(): StackSnapshot
    {
        $live = [];

        foreach ($this->frames as $frame) {
            if ($frame->isLive()) {
                $live[$frame->id] = $frame;
            }
        }

        return new StackSnapshot($this->frameIds(), $live, $this->top()->id);
    }

    /**
     * @return list<Frame> bottom first
     */
    public function frames(): array
    {
        return $this->frames;
    }

    /**
     * The frames of this stack, ready excepted, that the other stack does not hold, bottom first.
     *
     * @return list<Frame>
     */
    public function framesMissingFrom(self $other): array
    {
        $held = array_flip($other->frameIds());

        return array_values(
            array_filter($this->frames, fn (Frame $frame) => ! $frame->isBottom() && ! isset($held[$frame->id])),
        );
    }

    /**
     * The live top of this stack when a live frame covered it in the earlier stack and this change removed that frame,
     * so it comes back on top; none for ready, a new frame, a top that did not change, or a top only finished or
     * switched-off frames covered, since it already answered first.
     */
    public function topResumedSince(self $earlier): Frame|null
    {
        $top = $this->top();
        $earlierTop = $earlier->top();
        $coverRemoved = ! in_array($earlierTop->id, $this->frameIds(), true);
        $wasHeld = in_array($top->id, $earlier->frameIds(), true);

        if ($top->isBottom() || ! $wasHeld || $earlierTop->id === $top->id || ! $coverRemoved) {
            return null;
        }

        return $top;
    }

    /**
     * The highest live frame: the one a hook asks first and the only one that may push. Finished and switched-off
     * frames above it stay stored but are passed over.
     *
     * @throws MissingBottomState when the stack holds no live frame at all
     */
    public function top(): Frame
    {
        foreach (array_reverse($this->frames) as $frame) {
            if ($frame->isLive()) {
                return $frame;
            }
        }

        throw MissingBottomState::for('top');
    }

    /**
     * @return list<string>
     */
    public function frameIds(): array
    {
        return array_map(fn (Frame $frame) => $frame->id, $this->frames);
    }

    public function records(): FrameRecords
    {
        return new FrameRecords(array_map(fn (Frame $frame) => $frame->record(), $this->frames));
    }
}
