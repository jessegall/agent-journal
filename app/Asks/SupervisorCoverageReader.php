<?php

declare(strict_types=1);

namespace App\Asks;

use App\Actors\Contracts\AgentTexts;
use App\Asks\Contracts\AskType;
use App\Asks\Enums\SupervisorCoverageType;
use App\Attributes\Commands\Authorize;
use App\Bus\Contracts\Command;
use App\Support\CommandRegistry;
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
        $authorize = $this->commands->applicationAuthorizeOf($command);

        if ($profile === null || $authorize->isEmpty()) {
            return new SupervisorCoverage(
                $type->key(),
                SupervisorCoverageType::Unknown,
                $command,
                'The target or the required command has no profile declaration to check.',
            );
        }

        return $this->covered($type, $profile, $command, $authorize->get());
    }

    /**
     * @param  class-string<Command<mixed>>  $command
     */
    private function covered(
        AskType $type,
        SupervisorProfile $profile,
        string $command,
        Authorize $authorize,
    ): SupervisorCoverage {
        $decision = $profile->authorization->admits($command, $authorize);

        return new SupervisorCoverage(
            $type->key(),
            $decision->isAllowed ? SupervisorCoverageType::Supported : SupervisorCoverageType::Unsupported,
            $command,
            $this->texts->render($decision->reason),
        );
    }
}
