<?php

declare(strict_types=1);

namespace App\Agents\Commands\StartProfileMain;

use App\Agents\Commands\StartAgent\StartAgentCommand;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Exceptions\ProfileCannotCoordinate;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandHandler;
use App\Models\Agents\Agent;
use App\Models\Drivers\DriverConversation;
use App\Models\Profiles\Profile;
use App\Sessions\Contracts\ProfileSelections;
use App\Sessions\Contracts\StartPreflight;
use App\Sessions\Enums\StartOriginType;
use App\Sessions\StartPreviews;
use App\Sessions\StartReceipt;
use App\Values\StartRequest;

/**
 * Resolves the main profile's selection and runs Core's StartAgentCommand with it as a nested command, so the accepted
 * request keeps the revision and policy it was selected under.
 */
final readonly class StartProfileMainHandler implements CommandHandler
{
    public function __construct(
        private ProfileSelections $profiles,
        private CommandBus $commands,
        private StartPreflight $preflight,
        private StartPreviews $previews,
    ) {}

    /**
     * @throws ProfileCannotCoordinate
     */
    public function handle(StartProfileMainCommand $command): StartReceipt
    {
        $profile = $this->profiles->select($command->profile, $command->requested, $command->driverKey);

        if (! $profile->base->isCoordinator()) {
            throw ProfileCannotCoordinate::for($command->profile);
        }

        $agent = Agent::query()->findOrFail($command->agentId);

        $driverType = $this->previews->preview(
            $agent,
            $command->driverKey,
            $command->driverType,
            $command->requested,
            $profile->defaults,
            null,
        )->driverType;

        $this->preflight->assertAdmitted($profile->proposal($driverType, $command->requested->model));

        $target = $command->conversationId === null
            ? null
            : DriverConversation::resolveChosenFor(
                $command->conversationId,
                $agent->id,
                $profile->selection->driver,
                null,
            );

        return $this->commands->run(new StartAgentCommand(new StartRequest(
            $command->requestId,
            $command->agentId,
            $profile->selection,
            StartOriginType::MainStart,
            null,
            null,
            $command->conversationId === null ? ConversationModeType::New : ConversationModeType::Resume,
            null,
            $profile->startPolicy(),
            conversationTarget: $target,
            driverType: $driverType,
            chosenAccount: $command->chosenAccount,
            savesDriverType: $command->shouldSaveDriverType,
            previewRevision: $command->previewRevision,
        )));
    }
}
