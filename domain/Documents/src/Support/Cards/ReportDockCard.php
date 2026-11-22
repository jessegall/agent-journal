<?php

declare(strict_types=1);

namespace Domain\Documents\Support\Cards;

use App\Enums\Emphasis;
use App\Support\Cards\Button;
use App\Support\Cards\DestinationArgument;
use App\Support\Cards\DockCard;
use App\Support\Cards\DockDestination;
use App\Support\Cards\Stack;
use App\Support\Cards\Subtitle;
use App\Support\Cards\Title;
use App\Support\Sources\Contracts\CardContext;
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
