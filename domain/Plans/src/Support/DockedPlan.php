<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use App\Docking\Cards\Button;
use App\Docking\Cards\CountedProgress;
use App\Docking\Cards\DestinationArgument;
use App\Docking\Cards\DockCard;
use App\Docking\Cards\DockDestination;
use App\Docking\Cards\DockIdentity;
use App\Docking\Cards\Stack;
use App\Docking\Cards\Subtitle;
use App\Docking\Cards\Title;
use App\Docking\Enums\Emphasis;
use App\Docking\Sources\Contracts\CardContext;
use App\Docking\Sources\Contracts\Dockable;
use App\Docking\Sources\DockDefinition;
use Domain\Plans\Api\PlanCard;

/**
 * A plan as a dock shows it: its title, the phase it is at (the first unfinished one, as every plan card reads it),
 * and how many of its tasks are done; a plan with no phases shows no progress at all.
 */
final readonly class DockedPlan implements Dockable
{
    public function __construct(private PlanCard $plan, private string|null $currentPhaseTitle) {}

    public function identifyFor(DockDefinition $definition): DockIdentity
    {
        return $definition->identity($this->plan->id);
    }

    public function composeDockCard(CardContext $context): DockCard
    {
        $parts = [new Title('title', $this->plan->title), ...$this->stand()];
        $open = new DockDestination('plans.plan', new DestinationArgument('plan', (string) $this->plan->number));

        foreach ($context->permittedDestination($open) as $permitted) {
            $parts[] = new Button('open', 'Open', Emphasis::Primary, $permitted);
        }

        return DockCard::named($this->plan->title, Stack::of('root', ...$parts));
    }

    /**
     * @return list<Subtitle|CountedProgress>
     */
    private function stand(): array
    {
        if ($this->plan->currentPhase === null) {
            return [new Subtitle('phase', 'No phases yet')];
        }

        $progress = new CountedProgress('progress', $this->plan->progress->finished, $this->plan->progress->total);

        if ($this->plan->progress->isComplete()) {
            return [new Subtitle('phase', 'All phases complete'), $progress];
        }

        return [new Subtitle('phase', $this->currentPhaseTitle ?? "Phase {$this->plan->currentPhase}"), $progress];
    }
}
