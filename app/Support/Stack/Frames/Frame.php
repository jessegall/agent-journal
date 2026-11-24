<?php

declare(strict_types=1);

namespace App\Support\Stack\Frames;

use App\Contracts\Bus\Command;
use App\Contracts\Events\Event;
use App\Contracts\Work\ConditionalState;
use App\Declarations\StateMethod;
use App\Enums\StackMoment;
use App\Exceptions\StateAnswerRefused;
use App\Support\Decisions\Contracts\AnswerPart;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\References\StateReference;
use App\Support\Reflector;
use App\Support\StateLoading\StateValues;
use App\Support\States\AgentState;
use App\Support\States\StateReturnedParts;
use App\Support\Storage\FrameRecord;
use Carbon\CarbonImmutable;

/**
 * One state on a stack, with the frame id it is stored under, the reference it was built from and the time it entered
 * the stack, which never changes while the frame lives.
 */
final readonly class Frame
{
    public function __construct(
        public string $id,
        public StateReference $reference,
        public AgentState $state,
        public CarbonImmutable $enteredAt,
        private bool $isBottom = false,
        public int $schemaVersion = 1,
        private bool $isTypeEnabled = true,
    ) {}

    /**
     * The frame of a stored record, with whether its state type runs now as the restore found it.
     */
    public static function restored(FrameRecord $record, AgentState $state, bool $isTypeEnabled = true): self
    {
        return new self(
            $record->id,
            $record->reference,
            $state,
            $record->enteredAt,
            $record->isBottom,
            $record->schemaVersion,
            $isTypeEnabled,
        );
    }

    public function record(): FrameRecord
    {
        return new FrameRecord(
            $this->id,
            $this->reference,
            $this->isBottom,
            $this->schemaVersion,
            $this->enteredAt,
            StateValues::of($this->state),
        );
    }

    public function isBottom(): bool
    {
        return $this->isBottom;
    }

    public function typeKey(): string
    {
        return $this->reference->typeKey;
    }

    public function isFor(StateReference $reference): bool
    {
        return $this->reference->isSameAs($reference);
    }

    /**
     * Whether a push of the reference finds this frame in place of adding one, as the state's frame reuse says.
     */
    public function keepsOneFrameFor(StateReference $reference): bool
    {
        return $this->state->frameReuse()->keepsOneFrame($this->reference, $reference);
    }

    public function isFinished(): bool
    {
        return $this->state->isFinished();
    }

    /**
     * Whether the state may run now: not while its state type is switched off, and otherwise always, unless it is a
     * conditional state that answers it is switched off.
     */
    public function isEnabled(): bool
    {
        return $this->isTypeEnabled && (! $this->state instanceof ConditionalState || $this->state->isEnabled());
    }

    /**
     * Whether a hook asks this frame: its work is not done and it may run now. A frame that is not live stays stored.
     */
    public function isLive(): bool
    {
        return ! $this->isFinished() && $this->isEnabled();
    }

    /**
     * What the state's method for the hook returns, which its one caller reads.
     *
     * @return AnswerPart|Command<mixed>|Event|StateReference|iterable<AnswerPart|Command<mixed>|Event|StateReference>
     */
    public function answer(HookInput $input): AnswerPart|Command|Event|StateReference|iterable
    {
        return $input->answerBy($this->state);
    }

    /**
     * The state's method that answers a moment of its frame's life.
     */
    public function momentMethod(StackMoment $moment): StateMethod
    {
        return StateMethod::fromMethod($this->state::class, Reflector::of($this->state)->method($moment->value));
    }

    /**
     * The commands and events the state answers a moment of its frame's life with: nothing, one returned straight, or
     * each it yielded.
     *
     * @return list<Command<mixed>|Event>
     *
     * @throws StateAnswerRefused when it answered an array or anything but a command or an event
     */
    public function answerMoment(StackMoment $moment): array
    {
        $method = $this->state::class.'::'.$moment->value;

        $effects = StateReturnedParts::of(match ($moment) {
            StackMoment::Enter => $this->state->onEnter(),
            StackMoment::Resume => $this->state->onResume(),
            StackMoment::Exit => $this->state->onExit(),
        }, $method);

        foreach ($effects as $effect) {
            if (! $effect instanceof Command && ! $effect instanceof Event) {
                throw StateAnswerRefused::notAnEffect($method, $effect);
            }
        }

        return $effects;
    }

    /**
     * What the state's listener for the fact returns: nothing, a command or several, which its one caller checks.
     */
    public function answerEvent(Event $event, string $method): mixed
    {
        return $this->state->{$method}($event);
    }
}
