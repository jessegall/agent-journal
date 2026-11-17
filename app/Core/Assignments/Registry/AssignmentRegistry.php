<?php

declare(strict_types=1);

namespace App\Core\Assignments\Registry;

use App\Core\Actors\Enums\ActorKind;
use App\Core\Assignments\Contracts\AssignableProvider;
use App\Core\Assignments\Contracts\AssigneeProvider;
use App\Core\Assignments\Contracts\AssignmentRegistration;
use App\Core\Assignments\Exceptions\AssigneeKindRepeated;
use App\Core\Assignments\Exceptions\AssignmentProviderInvalid;
use App\Core\Assignments\Exceptions\AssignmentTypeRepeated;
use App\Core\Assignments\Exceptions\AssignmentTypeUnavailable;
use App\Core\Assignments\Support\AssigneeRegistration;
use App\Core\Assignments\Support\RecordIdentity;
use App\Core\Contracts\Assignable;
use App\Core\Links\Support\LinkTypes;
use Illuminate\Contracts\Container\Container;

/**
 * Which provider answers for each assignable record type and each kind of actor that can hold records. It keeps
 * class names only and builds a provider when one is asked for, so a provider that holds the request's actor is never
 * kept beyond its request.
 */
final class AssignmentRegistry implements AssignmentRegistration
{
    /**
     * @var array<string, class-string<AssignableProvider>>
     */
    private array $recordProviders = [];

    /**
     * @var array<string, class-string<AssigneeProvider>>
     */
    private array $assigneeProviders = [];

    public function __construct(private readonly Container $container) {}

    /**
     * @throws AssignmentTypeRepeated
     * @throws AssignmentProviderInvalid
     */
    public function registerRecord(string $type, string $providerClass): void
    {
        RecordIdentity::checkType($type);

        if (array_key_exists($type, $this->recordProviders)) {
            throw AssignmentTypeRepeated::for($type);
        }

        if (! is_subclass_of($providerClass, AssignableProvider::class)) {
            throw AssignmentProviderInvalid::forRecords($type, $providerClass);
        }

        $this->recordProviders[$type] = $providerClass;
    }

    /**
     * @throws AssigneeKindRepeated
     * @throws AssignmentProviderInvalid
     */
    public function registerAssignees(AssigneeRegistration $registration): void
    {
        $kind = $registration->kind->value;

        if (array_key_exists($kind, $this->assigneeProviders)) {
            throw AssigneeKindRepeated::for($registration->kind);
        }

        if (! is_subclass_of($registration->providerClass, AssigneeProvider::class)) {
            throw AssignmentProviderInvalid::forAssignees($registration->kind, $registration->providerClass);
        }

        $this->assigneeProviders[$kind] = $registration->providerClass;
    }

    /**
     * @throws AssignmentTypeUnavailable
     */
    public function recordProvider(string $type): AssignableProvider
    {
        $providerClass = $this->recordProviders[$type] ?? throw AssignmentTypeUnavailable::forType($type);

        return $this->container->make($providerClass);
    }

    /**
     * @throws AssignmentTypeUnavailable
     */
    public function assigneeProvider(ActorKind $kind): AssigneeProvider
    {
        $providerClass = $this->assigneeProviders[$kind->value] ?? throw AssignmentTypeUnavailable::forKind($kind);

        return $this->container->make($providerClass);
    }

    /**
     * Every registered record type is a link alias whose model is Assignable. Run once every owner has registered its
     * aliases, after the application booted.
     *
     * @throws AssignmentProviderInvalid
     */
    public function checkRecordModels(LinkTypes $links): void
    {
        foreach (array_keys($this->recordProviders) as $type) {
            $model = $links->modelFor($type);

            if (! is_subclass_of($model, Assignable::class)) {
                throw AssignmentProviderInvalid::forModel($type, $model);
            }
        }
    }
}
