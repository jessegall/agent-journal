<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Docking;

use App\Models\Runs\ProcessRun;
use App\Processes\Enums\PartEndType;
use App\Processes\Enums\Tone;
use Domain\Chat\Contracts\Docking\CardContext;
use Domain\Chat\Contracts\Docking\Dockable;
use Domain\Chat\Support\Cards\DockCard;
use Domain\Chat\Support\Cards\DockIdentity;
use Domain\Chat\Support\Cards\Duration;
use Domain\Chat\Support\Cards\Stack;
use Domain\Chat\Support\Cards\StateLabel;
use Domain\Chat\Support\Cards\Subtitle;
use Domain\Chat\Support\Cards\Title;
use Domain\Chat\Values\DockDefinition;

/**
 * A process run as a dock shows it, from the parts it was read with: the operation it runs, never its arguments,
 * whether it still runs, how long it ran, frozen at its end, and how it ended.
 */
final readonly class DockedRun implements Dockable
{
    public function __construct(private ProcessRun $run) {}

    public function identifyFor(DockDefinition $definition): DockIdentity
    {
        return $definition->identity($this->run->id);
    }

    public function composeDockCard(CardContext $context): DockCard
    {
        $parts = $this->run->parts->sortBy(['syntax_node', 'attempt']);

        $last = $parts->last();
        $title = $last === null ? 'Process run' : "Run of {$last->operation}";
        $ended = $this->run->areLoadedPartsFinal();
        $startedAt = $parts->first()?->started_at;

        $cardParts = [
            new Title('title', $title),
            new StateLabel('state', $ended ? 'Ended' : 'Running', $ended ? Tone::Muted : Tone::Note),
        ];

        if ($startedAt !== null) {
            $cardParts[] = new Duration('duration', $startedAt, $ended ? $last?->ended_at : null);
        }

        if ($ended && $last !== null) {
            $exit = $last->end_type === PartEndType::Exited ? "Exit {$last->end_code}" : 'Did not exit';
            $cardParts[] = new Subtitle('exit', $exit);
        }

        return DockCard::named($title, Stack::of('root', ...$cardParts));
    }
}
