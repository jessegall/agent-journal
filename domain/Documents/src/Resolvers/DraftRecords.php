<?php

declare(strict_types=1);

namespace Domain\Documents\Resolvers;

use App\Actors\Contracts\CurrentAuthorizer;
use Domain\Documents\Contracts\DraftResolver;
use Domain\Documents\Data\DraftState;
use Domain\Documents\Data\DraftView;
use Domain\Documents\Enums\DocumentAbility;
use Domain\Documents\Enums\EditingState;
use Domain\Documents\Exceptions\DraftMissing;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;
use Domain\Documents\Support\RequestEditor;
use Illuminate\Container\Attributes\Scoped;

#[Scoped]
final readonly class DraftRecords implements DraftResolver
{
    public function __construct(private RequestEditor $editors, private CurrentAuthorizer $authorizer) {}

    public function current(int $documentNumber): DraftView
    {
        $document = Document::query()->sharedPublished()->with('draft')->where(
            'number',
            $documentNumber,
        )->first() ?? throw DraftMissing::forDocument($documentNumber);
        $draft = $document->draft ?? throw DraftMissing::forDocument($documentNumber);

        if (! $this->editors->isEditing($draft)) {
            throw DraftMissing::forDocument($documentNumber);
        }

        return $draft->view($document);
    }

    public function stateOf(int $documentNumber): DraftState
    {
        $document = Document::query()->sharedPublished()->with('draft')->where(
            'number',
            $documentNumber,
        )->first() ?? throw DraftMissing::forDocument($documentNumber);
        $draft = $document->draft;

        if ($draft === null) {
            return DraftState::from(['state' => EditingState::Free]);
        }

        if (! $this->editors->isEditing($draft)) {
            $held = ['state' => EditingState::Held, 'holder' => $draft->holderLabel()];

            $administer = [DocumentAbility::Administer];
            $administers = $this->authorizer->filterActions(
                DocumentAdministrationPolicy::class,
                Document::class,
                $administer,
            ) !== [];

            return DraftState::from($administers ? [...$held, 'held' => $draft->view($document)] : $held);
        }

        return DraftState::from(['state' => EditingState::Yours, 'draft' => $draft->view($document)]);
    }
}
