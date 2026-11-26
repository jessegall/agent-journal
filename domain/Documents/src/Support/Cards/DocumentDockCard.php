<?php

declare(strict_types=1);

namespace Domain\Documents\Support\Cards;

use App\Docking\Cards\DestinationArgument;
use App\Docking\Cards\DockDestination;
use App\Docking\Sources\Contracts\CardContext;
use App\Support\Cards\Button;
use App\Support\Cards\DockCard;
use App\Support\Cards\Stack;
use App\Support\Cards\Subtitle;
use App\Support\Cards\Title;
use App\Web\Enums\Emphasis;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentRevision;

/**
 * A document's card in a dock: its current title, its revision and where it stands, with Open when the viewer may
 * open it.
 */
final readonly class DocumentDockCard
{
    public DockCard $card;

    public function __construct(Document $document, CardContext $context)
    {
        $revision = DocumentRevision::findCurrentOf($document);

        $parts = [
            new Title('title', $revision->title),
            new Subtitle('revision', "revision {$revision->number}"),
            $document->attention->stateLabel(),
        ];

        $argument = new DestinationArgument('document', (string) $document->number);
        $open = new DockDestination('documents.document', $argument);

        foreach ($context->permittedDestination($open) as $permitted) {
            $parts[] = new Button('open', 'Open', Emphasis::Primary, $permitted);
        }

        $this->card = DockCard::named($revision->title, Stack::of('root', ...$parts));
    }
}
