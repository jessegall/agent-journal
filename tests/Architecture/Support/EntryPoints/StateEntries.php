<?php

declare(strict_types=1);

namespace Tests\Architecture\Support\EntryPoints;

use App\Stacks\StateLoading\RegisteredStateType;
use App\Support\Reflector;
use App\Support\StateCatalog\Contracts\StateTypes;

/**
 * Every state type the booted journal registers, each with its one test file under the states folder of core or of
 * its domain.
 */
final readonly class StateEntries
{
    public function __construct(private StateTypes $types) {}

    /**
     * @return list<EntryPoint>
     */
    public function entries(): array
    {
        return array_values(array_map(function (RegisteredStateType $type): EntryPoint {
            $folder = EntryPoint::folderOf($type->stateClass, EntryType::State);
            $file = Reflector::of($type->stateClass)->shortName().'Test.php';

            return new EntryPoint(EntryType::State, $type->stateClass, "{$folder}/{$file}");
        }, $this->types->registry()->types()));
    }
}
