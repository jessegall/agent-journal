<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\Exceptions\AssignmentProviderInvalid;
use App\Assignments\Exceptions\AssignmentTypeInternal;
use App\Assignments\PoolDefinition;
use App\Exceptions\AssignmentTypeUnavailable;

/**
 * The provider, auto-assigner, work provider or pool factory that answers for a record type, an actor type or a pool
 * key, built for this request, and who owns each. Core-private: the writer, the readers and auto-assignment ask it;
 * only the composition sites register them.
 */
interface AssignmentProviders
{
    /**
     * Whether a provider answers for this record type.
     */
    public function hasRecordProvider(string $type): bool;

    /**
     * @throws AssignmentTypeUnavailable
     * @throws AssignmentProviderInvalid
     */
    public function recordProvider(string $type): AssignableProvider;

    /**
     * Refuses a record type that only Core's own writers assign, before anything is resolved or written.
     *
     * @throws AssignmentTypeInternal
     * @throws AssignmentTypeUnavailable
     */
    public function assertPublic(string $type): void;

    /**
     * Refuses a record type that public writers assign, so Core's own writer touches only its internal types.
     *
     * @throws AssignmentTypeUnavailable
     */
    public function assertInternal(string $type): void;

    /**
     * The provider of the record type that the journal's own tools assign through.
     */
    public function journalProvider(string $type): JournalAssignableProvider;

    /**
     * @throws AssignmentTypeUnavailable
     * @throws AssignmentProviderInvalid
     */
    public function assigneeProvider(string $type): AssigneeProvider;

    /**
     * Whether actors of the type may take work automatically now, as their owner answers it.
     *
     * @throws AssignmentTypeUnavailable
     * @throws AssignmentProviderInvalid
     */
    public function activity(string $type): AutoAssignmentActivity;

    /**
     * @throws AssignmentTypeUnavailable
     * @throws AssignmentProviderInvalid
     */
    public function autoAssigner(string $type): AutoAssigner;

    /**
     * @return class-string<AutoAssigner>
     *
     * @throws AssignmentProviderInvalid
     */
    public function autoAssignerClass(string $type): string;

    /**
     * @throws AssignmentTypeUnavailable
     * @throws AssignmentProviderInvalid
     */
    public function assignedWork(string $type): AssignedWorkProvider;

    /**
     * @throws AssignmentTypeUnavailable
     * @throws AssignmentProviderInvalid
     */
    public function poolFactory(string $key): AssignmentPoolFactory;

    /**
     * The name of the domain that registered the record type.
     *
     * @throws AssignmentTypeUnavailable
     */
    public function recordOwner(string $type): string;

    /**
     * The name of the domain that declared the pool.
     *
     * @throws AssignmentTypeUnavailable
     */
    public function poolOwner(string $key): string;

    /**
     * The pools that hold records of the type, in the order they were declared; none when no pool holds it.
     *
     * @return list<PoolDefinition>
     */
    public function pools(string $type): array;
}
