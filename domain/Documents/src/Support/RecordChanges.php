<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Exceptions\ActorNotAllowed;
use Domain\Documents\Enums\DocumentAbility;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;
use Illuminate\Database\Eloquent\Model;

/**
 * Who may change a document or a report: the actor that created it, or an actor granted changing others' records.
 */
final readonly class RecordChanges
{
    public function __construct(private CurrentActor $actors, private CurrentAuthorizer $authorizer) {}

    /**
     * @throws ActorNotAllowed
     */
    public function requireChangeOf(Model $record): void
    {
        if (! $this->createdByActor($record)) {
            $this->authorizer->authorize(DocumentAdministrationPolicy::class, Document::class, DocumentAbility::ChangeOthersRecords);
        }
    }

    public function mayChange(Model $record): bool
    {
        $others = [DocumentAbility::ChangeOthersRecords];

        return $this->createdByActor($record)
            || $this->authorizer->filterActions(DocumentAdministrationPolicy::class, Document::class, $others) !== [];
    }

    private function createdByActor(Model $record): bool
    {
        return method_exists($record, 'isCreatedBy') && $record->isCreatedBy($this->actors->actor());
    }
}
