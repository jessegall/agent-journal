<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Agents\Commands\StartAgent;
use App\Agents\Contracts\StartPreflight;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\StartOriginType;
use App\Agents\Models\Agent;
use App\Agents\Support\StartReceipt;
use App\Agents\Values\StartRequest;
use App\Bus\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use App\Profiles\Commands\StartProfileMain;
use App\Profiles\Contracts\ProfileSelections;
use App\Profiles\Exceptions\ProfileCannotCoordinate;
use App\Profiles\Models\Profile;

/**
 * Resolves the main profile's selection and runs Core's StartAgent with it as a nested command, so the accepted
 * request keeps the revision and policy it was selected under.
 */
final readonly class StartProfileMainHandler implements CommandHandler
{
    public function __construct(
        private ProfileSelections $profiles,
        private CommandBus $commands,
        private StartPreflight $preflight,
    ) {}

    /**
     * @throws ProfileCannotCoordinate
     */
    public function handle(StartProfileMain $command): StartReceipt
    {
        $profile = $this->profiles->select($command->profile, $command->requested, $command->driverKey, null);

        if (! $profile->base->isCoordinator()) {
            throw ProfileCannotCoordinate::for($command->profile);
        }

        $agent = Agent::query()->findOrFail($command->agentId);
        $variant = $agent->variantFor($command->variant, $profile->base->defaultVariant);
        $this->preflight->assertAdmitted($profile->proposal($variant, $command->requested->model));

        return $this->commands->run(new StartAgent(new StartRequest(
            $command->requestId,
            $command->agentId,
            $profile->selection,
            StartOriginType::MainStart,
            null,
            null,
            ConversationModeType::New,
            null,
            $profile->startPolicy(),
            variant: $variant,
            chosenAccount: $command->chosenAccount,
            savesVariant: $command->saveVariant,
        )));
    }
}
