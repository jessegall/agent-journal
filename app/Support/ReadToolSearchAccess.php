<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\ReadGrant;
use App\Contracts\SearchAccess;
use App\Values\AdmittedConstraints;
use App\Values\AllowedNames;
use App\Values\OpenAction;
use App\Values\ReadRequest;
use App\Values\RecordLocation;
use App\Values\SearchReader;

/**
 * The access of a searchable whose records an agent reads through one read tool by an id argument, such as
 * plans_read with plan_id: an agent whose grant holds the read for at least one record may search, limited to the
 * records it holds it for, and every signed-in user of the environment may search them all. The open action is
 * that read tool, asked the same targeted read before it is shown and again when it is opened.
 */
abstract readonly class ReadToolSearchAccess implements SearchAccess
{
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

    public function canUserSearch(ActorContext $user): bool
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
}
