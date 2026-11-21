<?php

declare(strict_types=1);

namespace Domain\Documents\Cards;

use App\Docking\Cards\Button;
use App\Docking\Cards\DestinationArgument;
use App\Docking\Cards\DockCard;
use App\Docking\Cards\DockDestination;
use App\Docking\Cards\Stack;
use App\Docking\Cards\Subtitle;
use App\Docking\Cards\Title;
use App\Docking\Enums\Emphasis;
use App\Docking\Sources\Contracts\CardContext;
use Domain\Documents\Models\Report;

/**
 * A report's card in a dock: its title, where it stands and the start of its abstract, with Open when the viewer may
 * open it.
 */
final readonly class ReportDockCard
{
    /**
     * The most characters of a report's abstract its docked card shows.
     */
    private const int ABSTRACT_CHARACTER_LIMIT = 120;

    public DockCard $card;

    public function __construct(Report $report, CardContext $context)
    {
        $parts = [
            new Title('title', $report->title),
            $report->attention->stateLabel(),
            new Subtitle('abstract', mb_strimwidth($report->abstract, 0, self::ABSTRACT_CHARACTER_LIMIT, '…')),
        ];

        $open = new DockDestination('documents.report', new DestinationArgument('report', (string) $report->number));

        foreach ($context->permittedDestination($open) as $permitted) {
            $parts[] = new Button('open', 'Open', Emphasis::Primary, $permitted);
        }

        $this->card = DockCard::named($report->title, Stack::of('root', ...$parts));
    }
}
