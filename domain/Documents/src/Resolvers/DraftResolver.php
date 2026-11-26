<?php

declare(strict_types=1);

namespace Domain\Documents\Resolvers;

use App\Access\Contracts\CurrentAuthorizer;
use App\Agents\Enums\AccessType;
use Domain\Documents\Contracts\Drafts\DraftResolver as DraftResolverContract;
use Domain\Documents\Data\DraftState;
use Domain\Documents\Data\DraftView;
use Domain\Documents\Enums\EditingStatus;
use Domain\Documents\Exceptions\DraftMissing;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;
use Domain\Documents\Support\RequestEditor;
use Illuminate\Container\Attributes\Scoped;

#[Scoped]
final readonly class DraftResolver implements DraftResolverContract
{
    public function __construct(private RequestEditor $editors, private CurrentAuthorizer $authorizer) {}

    public function current(int $documentNumber): DraftView
    {
        $document = Document::query()->sharedPublished()->withDraft()->withNumber($documentNumber)->firstOr(
            DraftMissing::throwing()->forDocument($documentNumber),
        );

        $draft = $document->draft ?? throw DraftMissing::forDocument($documentNumber);

        if (! $this->editors->isEditing($draft)) {
            throw DraftMissing::forDocument($documentNumber);
        }

        return $draft->view($document);
    }

    public function stateOf(int $documentNumber): DraftState
    {
        $document = Document::query()->sharedPublished()->withDraft()->withNumber($documentNumber)->firstOr(
            DraftMissing::throwing()->forDocument($documentNumber),
        );

        $draft = $document->draft;

        if ($draft === null) {
            return DraftState::from(['status' => EditingStatus::Free]);
        }

        if (! $this->editors->isEditing($draft)) {
            $held = ['status' => EditingStatus::Held, 'holder' => $draft->holderLabel];

            $administrativeAccesses = [AccessType::Edit];

            $mayAdminister = $this->authorizer->filterActions(
                DocumentAdministrationPolicy::class,
                Document::class,
                $administrativeAccesses,
            ) !== [];

            return DraftState::from($mayAdminister ? [
                ...$held,
                'held' => $draft->view($document),
            ] : $held);
        }

        return DraftState::from(['status' => EditingStatus::HeldByViewer, 'draft' => $draft->view($document)]);
    }
}
