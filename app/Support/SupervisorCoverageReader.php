<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\AgentTexts;
use App\Contracts\Chat\AskType;
use App\Enums\SupervisorCoverageType;
use App\Values\SupervisorCoverage;
use App\Values\SupervisorProfile;
use App\Values\SupervisorRoutes;

final readonly class SupervisorCoverageReader
{
    public function __construct(
        private CommandRegistry $commands,
        private AskTypeRegistry $types,
        private AgentTexts $texts,
    ) {}

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
            $this->texts->render($decision->reason),
        );
    }
}
