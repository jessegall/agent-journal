<?php

declare(strict_types=1);

namespace App\Support;

use App\Access\Contracts\ReadGrant;
use App\Search\Contracts\SearchAccess;
use App\Search\Values\AdmittedConstraints;
use App\Search\Values\OpenAction;
use App\Search\Values\RecordLocation;
use App\Search\Values\SearchReader;
use App\Values\AllowedNames;
use App\Values\ReadRequest;

/**
 * The access of a searchable read through one read tool by id, such as plans_read with plan_id: an agent holding the
 * read for a record may search those records, and every signed-in user may search them all. The open action is that
 * read tool, checked again before it is shown and when it opens.
 */
abstract readonly class ReadToolSearchAccess implements SearchAccess
{
    /**
     * Takes the read grant that decides whether the user may use the read tool.
     */
    public function __construct(protected ReadGrant $reads) {}

    /**
     * The read tool that opens a record, such as plans_read.
     */
    abstract protected function readName(): string;

    /**
     * The argument that read takes the record's id in, such as plan_id.
     */
    abstract protected function idArgument(): string;

    public function agentRead(): ReadRequest
    {
        return ReadRequest::forDiscovery($this->readName());
    }

    public function canUserSearch(ActorReference $user): bool
    {
        return true;
    }

    /**
     * The record ids the reader's grant names, compiled once for the batch; views, fields and passages are those the
     * read tool shows, so they stay unrestricted.
     */
    public function constraints(SearchReader $reader): AdmittedConstraints
    {
        if (! $reader->isAgent()) {
            return AdmittedConstraints::unrestricted();
        }

        return new AdmittedConstraints(
            $this->reads->allowedTargets($this->readName()),
            AllowedNames::all(),
            AllowedNames::all(),
            AllowedNames::all(),
        );
    }

    public function admitsOpen(SearchReader $reader, string $recordId): bool
    {
        if (! $reader->isAgent()) {
            return true;
        }

        return $this->reads->allows(ReadRequest::forRecord($this->readName(), $this->idArgument(), $recordId));
    }

    public function openAction(string $recordId, RecordLocation|null $location): OpenAction
    {
        return new OpenAction($this->readName(), [$this->idArgument() => $recordId]);
    }

    /**
     * @return array<string, string>
     */
    public function pageQuery(RecordLocation|null $location): array
    {
        return [];
    }
}
