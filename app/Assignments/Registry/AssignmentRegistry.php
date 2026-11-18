<?php

declare(strict_types=1);

namespace App\Assignments\Registry;

use App\Actors\Enums\ActorType;
use App\Assignments\Contracts\Assignable;
use App\Assignments\Contracts\AssignableProvider;
use App\Assignments\Contracts\AssigneeProvider;
use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Contracts\AssignmentRegistration;
use App\Assignments\Exceptions\AssigneeTypeRepeated;
use App\Assignments\Exceptions\AssignmentProviderInvalid;
use App\Assignments\Exceptions\AssignmentTypeRepeated;
use App\Assignments\Exceptions\AssignmentTypeUnavailable;
use App\Assignments\Support\AssigneeRegistration;
use App\Links\Support\LinkTypeRegistry;
use App\Records\Support\RecordIdentity;
use Illuminate\Contracts\Container\Container;

/**
 * Which provider answers for each assignable record type and each type of actor that can hold records. It keeps
 * class names only and builds a provider when one is asked for, so a provider that holds the request's actor is never
 * kept beyond its request.
 */
final class AssignmentRegistry implements AssignmentProviders, AssignmentRegistration
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
     * @throws AssigneeTypeRepeated
     * @throws AssignmentProviderInvalid
     */
    public function registerAssignees(AssigneeRegistration $registration): void
    {
        $type = $registration->type->value;

        if (array_key_exists($type, $this->assigneeProviders)) {
            throw AssigneeTypeRepeated::for($registration->type);
        }

        if (! is_subclass_of($registration->providerClass, AssigneeProvider::class)) {
            throw AssignmentProviderInvalid::forAssignees($registration->type, $registration->providerClass);
        }

        $this->assigneeProviders[$type] = $registration->providerClass;
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
    public function assigneeProvider(ActorType $type): AssigneeProvider
    {
        $providerClass = $this->assigneeProviders[$type->value] ?? throw AssignmentTypeUnavailable::forActorType($type);

        return $this->container->make($providerClass);
    }

    /**
     * Every registered record type is a link alias whose model is Assignable. Run once every owner has registered its
     * aliases, after the application booted.
     *
     * @throws AssignmentProviderInvalid
     */
    public function checkRecordModels(LinkTypeRegistry $links): void
    {
        foreach (array_keys($this->recordProviders) as $type) {
            $model = $links->modelFor($type);

            if (! is_subclass_of($model, Assignable::class)) {
                throw AssignmentProviderInvalid::forModel($type, $model);
            }
        }
    }
}
