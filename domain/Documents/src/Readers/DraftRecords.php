<?php

declare(strict_types=1);

namespace Domain\Documents\Readers;

use Domain\Documents\Contracts\DraftReader;
use Domain\Documents\Contracts\EditorContext;
use Domain\Documents\Data\DraftState;
use Domain\Documents\Data\DraftView;
use Domain\Documents\Enums\EditingState;
use Domain\Documents\Exceptions\DraftConflict;
use Domain\Documents\Exceptions\DraftMissing;
use Domain\Documents\Models\Document;
use Illuminate\Container\Attributes\Scoped;

#[Scoped]
final readonly class DraftRecords implements DraftReader
{
    public function __construct(private EditorContext $editors) {}

    public function current(int $documentNumber): DraftView
    {
        $document = Document::query()->sharedPublished()->with('draft')->where('number', $documentNumber)->first() ?? throw DraftMissing::forDocument($documentNumber);
        $draft = $document->draft ?? throw DraftMissing::forDocument($documentNumber);

        try {
            $draft->requireEditor($this->editors->editor());
        } catch (DraftConflict) {
            throw DraftMissing::forDocument($documentNumber);
        }

        return $draft->view($document);
    }

    public function stateOf(int $documentNumber): DraftState
    {
        $document = Document::query()->sharedPublished()->with('draft')->where('number', $documentNumber)->first() ?? throw DraftMissing::forDocument($documentNumber);
        $draft = $document->draft;

        if ($draft === null) {
            return DraftState::from(['state' => EditingState::Free]);
        }

        $editor = $this->editors->editor();

        try {
            $draft->requireEditor($editor);
        } catch (DraftConflict) {
            $held = ['state' => EditingState::Held, 'holder' => $draft->holderLabel()];

            return DraftState::from($editor->type->isUser() ? [...$held, 'held' => $draft->view($document)] : $held);
        }

        return DraftState::from(['state' => EditingState::Yours, 'draft' => $draft->view($document)]);
    }
}
