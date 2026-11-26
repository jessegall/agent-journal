<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use App\Docking\Sources\Contracts\CardContext;
use App\Support\Cards\DockCard;
use App\Support\Cards\DockIdentity;
use App\Support\Cards\Stack;
use App\Support\Cards\Subtitle;
use App\Support\Cards\Title;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\DockDefinition;
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
        $parts = [new Title('title', $this->task->title), $this->task->status->stateLabel()];

        if ($this->holderName !== null) {
            $parts[] = new Subtitle('holder', $this->holderName);
        }

        return DockCard::named($this->task->title, Stack::of('root', ...$parts));
    }
}
