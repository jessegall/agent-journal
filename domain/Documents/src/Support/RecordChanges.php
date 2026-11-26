<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Access\Contracts\CurrentAuthorizer;
use App\Actors\Contracts\CurrentActor;
use App\Agents\Enums\AccessType;
use App\Exceptions\ActorNotAllowed;
use App\Reflection\Contracts\TypeReflections;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;
use Illuminate\Database\Eloquent\Model;

/**
 * Who may change a document or a report: the actor that created it, or an actor granted changing others' records.
 */
final readonly class RecordChanges
{
    public function __construct(
        private CurrentActor $actors,
        private CurrentAuthorizer $authorizer,
        private TypeReflections $reflections,
    ) {}

    /**
     * @throws ActorNotAllowed
     */
    public function requireChangeOf(Model $record): void
    {
        if (! $this->isCreatedByActor($record)) {
            $this->authorizer->authorize(
                DocumentAdministrationPolicy::class,
                Document::class,
                AccessType::Edit,
            );
        }
    }

    public function mayChange(Model $record): bool
    {
        $others = [AccessType::Edit];

        return $this->isCreatedByActor($record)
            || $this->authorizer->filterActions(DocumentAdministrationPolicy::class, Document::class, $others) !== [];
    }

    private function isCreatedByActor(Model $record): bool
    {
        $type = $this->reflections->of($record);

        return $type->hasMethod('isCreatedBy')
            && $type->invokeMethod('isCreatedBy', $record, $this->actors->actor()) === true;
    }
}
