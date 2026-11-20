<?php

declare(strict_types=1);

namespace App\Supervision\Support;

use App\Agents\Values\Operation;
use App\Bus\Support\CommandRegistry;
use App\Profiles\Enums\SupervisorCoverageType;
use App\Profiles\Values\SupervisorCoverage;
use App\Profiles\Values\SupervisorProfile;
use App\Profiles\Values\SupervisorRoutes;
use App\Supervision\Contracts\AskType;

final readonly class SupervisorCoverageReader
{
    public function __construct(private CommandRegistry $commands, private AskTypeRegistry $types) {}

    /**
     * @param  array<string, SupervisorProfile>  $profiles
     * @return list<SupervisorCoverage>
     */
    public function forRoutes(SupervisorRoutes $routes, array $profiles): array
    {
        return array_map(
            fn (AskType $type) => $this->forType($type, $profiles[$routes->targetFor($type->key())->key] ?? null),
            $this->types->all(),
        );
    }

    private function forType(AskType $type, SupervisorProfile|null $profile): SupervisorCoverage
    {
        $name = $type->operation()->key;
        $found = $this->commands->operationNamed($name);

        if ($profile === null || $found->isEmpty()) {
            return new SupervisorCoverage(
                $type->key(),
                SupervisorCoverageType::Unknown,
                $name,
                'The target or required operation has no profile declaration to check.',
            );
        }

        $declaration = $found->get();
        $decision = $profile->access->decide(
            Operation::journal($declaration->name, $declaration->area, $declaration->accessTypes),
        );

        return new SupervisorCoverage(
            $type->key(),
            $decision->allowed ? SupervisorCoverageType::Supported : SupervisorCoverageType::Unsupported,
            $name,
            $decision->reason,
        );
    }
}
