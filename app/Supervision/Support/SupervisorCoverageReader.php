<?php

declare(strict_types=1);

namespace App\Supervision\Support;

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
        $command = $type->requiredCommand();
        $authorize = $this->commands->has($command) ? $this->commands->authorizeOf($command) : null;

        if ($profile === null || $authorize === null) {
            return new SupervisorCoverage(
                $type->key(),
                SupervisorCoverageType::Unknown,
                $command,
                'The target or the required command has no profile declaration to check.',
            );
        }

        $decision = $profile->authorization->admits($command, $authorize);

        return new SupervisorCoverage(
            $type->key(),
            $decision->allowed ? SupervisorCoverageType::Supported : SupervisorCoverageType::Unsupported,
            $command,
            $decision->reason,
        );
    }
}
