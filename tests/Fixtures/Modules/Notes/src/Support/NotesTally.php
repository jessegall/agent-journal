<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Support;

use App\Docking\Cards\DockCard;
use App\Docking\Cards\DockIdentity;
use App\Docking\Cards\Stack;
use App\Docking\Cards\Title;
use App\Docking\Sources\Contracts\CardContext;
use App\Docking\Sources\Contracts\Dockable;
use App\Docking\Sources\DockDefinition;

/**
 * How many notes there are: a durable value with no row of its own, named by a stable key and made again from the
 * notes whenever it is read.
 */
final readonly class NotesTally implements Dockable
{
    public const string KEY = 'all-notes';

    public function __construct(private int $count) {}

    public function identifyFor(DockDefinition $definition): DockIdentity
    {
        return $definition->identity(self::KEY);
    }

    public function composeDockCard(CardContext $context): DockCard
    {
        return DockCard::named("{$this->count} notes", Stack::of('root', new Title('count', "{$this->count} notes")));
    }
}
