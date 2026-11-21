<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use App\Docking\Cards\DockCard;
use App\Docking\Cards\DockIdentity;
use App\Docking\Cards\Stack;
use App\Docking\Cards\Subtitle;
use App\Docking\Cards\Title;
use App\Docking\Sources\Contracts\CardContext;
use App\Docking\Sources\Contracts\Dockable;
use App\Docking\Sources\DockDefinition;
use Domain\Tasks\Models\Task;

/**
 * A task as a dock shows it: its title, its state, and who holds it when the viewer may see that.
 */
final readonly class DockedTask implements Dockable
{
    public function __construct(private Task $task, private string|null $holderName) {}

    public function identifyFor(DockDefinition $definition): DockIdentity
    {
        return $definition->identity($this->task->id);
    }

    public function composeDockCard(CardContext $context): DockCard
    {
        $parts = [new Title('title', $this->task->title), $this->task->state->stateLabel()];

        if ($this->holderName !== null) {
            $parts[] = new Subtitle('holder', $this->holderName);
        }

        return DockCard::named($this->task->title, Stack::of('root', ...$parts));
    }
}
