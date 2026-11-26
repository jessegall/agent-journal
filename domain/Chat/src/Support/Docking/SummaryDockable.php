<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Docking;

use App\Records\Values\RecordStanding;
use App\Records\Values\RecordSummary;
use App\Records\Values\SummaryLine;
use App\Web\Enums\Alignment;
use App\Web\Enums\Emphasis;
use Domain\Chat\Contracts\Docking\CardContext;
use Domain\Chat\Contracts\Docking\Dockable;
use Domain\Chat\Contracts\Docking\DockPart;
use Domain\Chat\Support\Cards\Button;
use Domain\Chat\Support\Cards\CountedProgress;
use Domain\Chat\Support\Cards\DestinationArgument;
use Domain\Chat\Support\Cards\DockCard;
use Domain\Chat\Support\Cards\DockDestination;
use Domain\Chat\Support\Cards\DockIdentity;
use Domain\Chat\Support\Cards\Duration;
use Domain\Chat\Support\Cards\Row;
use Domain\Chat\Support\Cards\Stack;
use Domain\Chat\Support\Cards\StateLabel;
use Domain\Chat\Support\Cards\Subtitle;
use Domain\Chat\Support\Cards\Title;
use Domain\Chat\Values\DockDefinition;
use PhpOption\None;
use PhpOption\Option;

/**
 * A record docked as its owner summarizes it: its title, where it stands, how long it ran, its lines, how far it got,
 * and Open when the viewer may open its page.
 */
final readonly class SummaryDockable implements Dockable
{
    public function __construct(private RecordSummary $summary) {}

    public function identifyFor(DockDefinition $definition): DockIdentity
    {
        return $definition->identity($this->summary->id);
    }

    public function composeDockCard(CardContext $context): DockCard
    {
        $parts = [new Title('title', $this->summary->title)];

        if ($this->summary->standing !== null) {
            $parts[] = self::label('state', $this->summary->standing);
        }

        if ($this->summary->period !== null) {
            $parts[] = new Duration('duration', $this->summary->period->startedAt, $this->summary->period->finishedAt);
        }

        foreach ($this->summary->lines as $line) {
            $parts[] = self::line($line);
        }

        $progress = $this->summary->progress;

        if ($progress !== null) {
            $parts[] = new CountedProgress('progress', $progress->finished, $progress->total);
        }

        foreach ($this->openPage($context) as $permitted) {
            $parts[] = new Button('open', 'Open', Emphasis::Primary, $permitted);
        }

        return DockCard::named($this->summary->title, Stack::of('root', ...$parts));
    }

    /**
     * The record's page when it has one the viewer may open.
     *
     * @return Option<DockDestination>
     */
    private function openPage(CardContext $context): Option
    {
        $page = $this->summary->page;

        if ($page === null) {
            return None::create();
        }

        return $context->permittedDestination(
            new DockDestination($page->page, new DestinationArgument($page->argument, $page->value)),
        );
    }

    /**
     * A line alone, or beside where it stands when it is a step.
     */
    private static function line(SummaryLine $line): DockPart
    {
        if ($line->standing === null) {
            return new Subtitle($line->key, $line->text);
        }

        return new Row(
            $line->key,
            Alignment::Between,
            new Subtitle("{$line->key}-text", $line->text),
            self::label("{$line->key}-state", $line->standing),
        );
    }

    private static function label(string $key, RecordStanding $standing): StateLabel
    {
        return new StateLabel($key, $standing->word, $standing->tone);
    }
}
