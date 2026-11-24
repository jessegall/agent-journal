<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages\Resolvers;

use App\Contracts\Navigation\SectionResolver;
use App\Declarations\SlotContext;
use Domain\Documents\Data\DockData;
use Domain\Documents\Enums\AttentionState;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\Report;

/**
 * Suggests documents and reports for Chat's dock: the newest ones still asking for attention. It stores nothing;
 * docking one is the user's own action in Chat.
 */
final readonly class DocumentDockResolver implements SectionResolver
{
    public const int SUGGESTIONS_SHOWN = 10;

    public function read(SlotContext $context): DockData
    {
        $documents = Document::query()
            ->with('currentRevision')
            ->inAttention(AttentionState::Active)
            ->latest('id')
            ->limit(self::SUGGESTIONS_SHOWN)
            ->get();

        $reports = Report::query()
            ->inAttention(AttentionState::Active)
            ->latest('id')
            ->limit(self::SUGGESTIONS_SHOWN)
            ->get();

        return DockData::from(['suggestions' => array_slice([
            ...$documents->map(fn (Document $document) => $document->dockCard)->all(),
            ...$reports->map(fn (Report $report) => $report->dockCard)->all(),
        ], 0, self::SUGGESTIONS_SHOWN)]);
    }
}
