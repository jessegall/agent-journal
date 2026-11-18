<?php

declare(strict_types=1);

namespace Domain\Documents\Readers;

use App\Agents\Contracts\SessionReader;
use App\Ui\Contracts\SectionReader;
use App\Ui\Declarations\SlotContext;
use Domain\Documents\Data\DockCard;
use Domain\Documents\Data\DockData;
use Domain\Documents\Enums\AttentionState;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\RecordDock;
use Domain\Documents\Models\Report;
use Illuminate\Support\Collection;

/**
 * The documents and reports docked in Chat's dock beside the chosen session: the ten newest active cards with a
 * continuation, and the hidden ones to show again. The session is checked first, so a session the actor may not
 * use shows nothing.
 */
final readonly class DocumentDockReader implements SectionReader
{
    public const int CARDS_SHOWN = 10;

    public function __construct(private SessionReader $sessions) {}

    public function read(SlotContext $context): DockData
    {
        $sessionId = (string) $context->id;
        $docks = RecordDock::query()->inDockOf($this->sessions->requireActive($sessionId)->actorIdentity())->readAll('a session dock holds the cards its agent made, shown ten at a time')->get();
        $visible = $this->cardsOf($docks->where('hidden_from_dock', false));

        return DockData::from([
            'sessionId' => $sessionId,
            'cards' => array_slice($visible, 0, self::CARDS_SHOWN),
            'hasMore' => count($visible) > self::CARDS_SHOWN,
            'hidden' => $this->cardsOf($docks->where('hidden_from_dock', true)),
        ]);
    }

    /**
     * The cards of the docked records that still ask for attention, in dock order.
     *
     * @param  Collection<int, RecordDock>  $docks
     * @return list<DockCard>
     */
    private function cardsOf(Collection $docks): array
    {
        $documents = Document::query()->with('currentRevision')->inAttention(AttentionState::Active)->whereKey($docks->where('parent_type', Document::LINK_TYPE)->pluck('parent_id')->all())->readLimit($docks->count())->get()->keyBy('id');
        $reports = Report::query()->inAttention(AttentionState::Active)->whereKey($docks->where('parent_type', Report::LINK_TYPE)->pluck('parent_id')->all())->readLimit($docks->count())->get()->keyBy('id');
        $cards = [...$documents->map(fn (Document $document) => $document->dockCard())->all(), ...$reports->map(fn (Report $report) => $report->dockCard())->all()];

        return array_values($docks->map(fn (RecordDock $dock) => $cards[$dock->parent_id] ?? null)->filter()->all());
    }
}
