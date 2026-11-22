<?php

declare(strict_types=1);

namespace Domain\Sequences\Models;

use App\Concerns\BoundedReads;
use App\Concerns\HasNumber;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\EventSource;
use App\Contracts\Numbered;
use App\Contracts\ReadableModel;
use App\Enums\Alignment;
use App\Enums\Tone;
use App\Models\Support\BelongsToOneActor;
use App\Support\ActorIdentity;
use App\Support\Cards\DockCard;
use App\Support\Cards\DockIdentity;
use App\Support\Cards\Duration;
use App\Support\Cards\Row;
use App\Support\Cards\Stack;
use App\Support\Cards\StateLabel;
use App\Support\Cards\Subtitle;
use App\Support\Cards\Title;
use App\Support\Sources\Contracts\CardContext;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\DockDefinition;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Domain\Sequences\Enums\SequenceRunState;
use Domain\Sequences\Events\SequenceEnded;
use Domain\Sequences\Events\SequenceStarted;
use Domain\Sequences\Events\SequenceStepEnded;
use Domain\Sequences\Events\SequenceStepReached;
use Domain\Sequences\Exceptions\SequenceRunMissing;
use Domain\Sequences\Support\SequenceWork;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * One run of a sequence: its steps, the step it is on and whether it still runs. The agent and session following it are
 * set by starting it.
 * Only the agent following it reads it.
 *
 * @property string $id
 * @property string $number_group_id
 * @property string|null $sequence_id
 * @property int $number
 * @property string $name
 * @property list<string> $steps
 * @property int $current_step
 * @property SequenceRunState $state
 * @property string|null $actor_type
 * @property string|null $actor_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'steps'])]
final class SequenceRun extends Model implements Dockable, EventSource, Numbered, ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasNumber;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * The run's stable name in links and in the chat lines that show it.
     */
    public const string LINK_TYPE = 'sequences.sequence-run';

    /**
     * @var array<string, mixed>
     */
    protected $attributes = ['current_step' => 1, 'state' => 'running'];

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'steps' => 'array',
            'current_step' => 'integer',
            'state' => SequenceRunState::class,
        ];
    }

    /**
     * A run of the named steps, not started yet.
     *
     * @param  list<string>  $steps
     */
    public static function create(string $name, array $steps): self
    {
        $run = new self();
        $run->name = $name;
        $run->steps = $steps;
        $run->save();

        return $run;
    }

    // ----------[ Queries ]----------

    /**
     * @return BelongsTo<Sequence, $this>
     */
    public function sequence(): BelongsTo
    {
        return $this->belongsTo(Sequence::class);
    }

    /**
     * The run read under its row lock, among those the actor may see, for a change that must happen once.
     */
    public static function lockedById(string $id): self
    {
        // A run belongs to no actor until it is started, so its start may also take a run nobody follows yet.
        return self::lockedForActorOrUnheld($id) ?? throw SequenceRunMissing::forId($id);
    }

    // ----------[ Mutations ]----------

    public function startFor(ActorIdentity $follower, string $sessionId): void
    {
        $this->current_step = 1;
        $this->state = SequenceRunState::Running;
        $this->belongTo($follower);
        $this->assertSaved($this->save());
        $this->raise(new SequenceStarted($this->id, new StackTarget($follower->id, $sessionId)));
        $this->raise(new SequenceStepReached($this->id, $this->owningActor(), $this->current_step));
    }

    /**
     * Moves to the next step, and finishes the run after its last step.
     */
    public function advance(): void
    {
        $ended = $this->current_step;

        if ($ended >= count($this->steps)) {
            $this->state = SequenceRunState::Finished;
            $this->assertSaved($this->save());
            $this->raise(new SequenceStepEnded($this->id, $this->owningActor(), $ended));
            $this->raise(new SequenceEnded($this->id, $this->owningActor(), $this->state));

            return;
        }

        $this->current_step++;
        $this->assertSaved($this->save());
        $this->raise(new SequenceStepEnded($this->id, $this->owningActor(), $ended));
        $this->raise(new SequenceStepReached($this->id, $this->owningActor(), $this->current_step));
    }

    public function cancel(): void
    {
        $this->state = SequenceRunState::Cancelled;
        $this->assertSaved($this->save());
        $this->raise(new SequenceEnded($this->id, $this->owningActor(), $this->state));
    }

    /**
     * What the chat says of a step the run came to: the step's place among them and its words.
     */
    public function stepLine(int $step): string
    {
        return "step {$step} of ".count($this->steps).' · '.$this->steps[$step - 1];
    }

    // ----------[ Answers ]----------

    public function identifyFor(DockDefinition $definition): DockIdentity
    {
        return $definition->identity($this->id);
    }

    /**
     * Its card where the chat shows it: its name and where it stands, each step with whether it is done, runs now or
     * waits, and how long it has run, frozen at its end.
     */
    public function composeDockCard(CardContext $context): DockCard
    {
        $steps = array_map(fn (string $step, int $index) => new Row(
            "step-{$index}",
            Alignment::Between,
            new Subtitle("step-{$index}-text", ($index + 1).' · '.$step),
            $this->stepLabel($index + 1),
        ), $this->steps, array_keys($this->steps));

        $started = CarbonImmutable::instance($this->created_at ?? CarbonImmutable::now());
        $ended = $this->state->needsWork() ? null : CarbonImmutable::instance($this->updated_at ?? $started);

        return DockCard::named($this->name, Stack::of(
            'root',
            new Title('title', $this->name),
            new Duration('duration', $started, $ended),
            ...$steps,
        ));
    }

    /**
     * Where a step stands: done, running now, or waiting for its turn, and how the run ended on its current step.
     */
    private function stepLabel(int $step): StateLabel
    {
        $key = "step-{$step}-state";
        $isDone = $step < $this->current_step || $this->state === SequenceRunState::Finished;
        $isRunning = $step === $this->current_step && $this->state->needsWork();

        return match (true) {
            $isDone => new StateLabel($key, 'Done', Tone::Muted),
            $isRunning => new StateLabel($key, 'Running', Tone::Note),
            default => new StateLabel($key, 'Waiting', Tone::Neutral),
        };
    }

    public function work(): SequenceWork
    {
        return new SequenceWork(
            $this->number,
            $this->current_step,
            $this->steps[$this->current_step - 1],
            $this->state,
        );
    }
}
