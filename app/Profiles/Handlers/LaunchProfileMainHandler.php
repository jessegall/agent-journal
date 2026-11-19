<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Agents\Commands\LaunchAgent;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\LaunchOriginType;
use App\Agents\Support\LaunchReceipt;
use App\Agents\Support\LaunchRequest;
use App\Bus\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use App\Profiles\Commands\LaunchProfileMain;
use App\Profiles\Contracts\ProfileSelections;
use App\Profiles\Enums\ProfileType;
use App\Profiles\Exceptions\ProfileTypeConflict;
use App\Profiles\Models\Profile;

/**
 * Resolves the main profile's selection and runs Core's LaunchAgent with it as a nested command, so the accepted
 * request keeps the revision and policy it was selected under.
 */
final readonly class LaunchProfileMainHandler implements CommandHandler
{
    public function __construct(
        private ProfileSelections $profiles,
        private CommandBus $commands,
    ) {}

    /**
     * @throws ProfileTypeConflict
     */
    public function handle(LaunchProfileMain $command): LaunchReceipt
    {
        $profile = $this->profiles->select($command->profile, $command->requested, $command->programKey, null);

        if ($profile->type !== ProfileType::MainAgent) {
            throw ProfileTypeConflict::for($command->profile, ProfileType::MainAgent, $profile->type);
        }

        return $this->commands->run(new LaunchAgent(new LaunchRequest(
            $command->requestId,
            $command->agentId,
            $profile->selection,
            LaunchOriginType::MainLaunch,
            null,
            null,
            ConversationModeType::New,
            null,
            $profile->launch->execution,
        )));
    }
}
