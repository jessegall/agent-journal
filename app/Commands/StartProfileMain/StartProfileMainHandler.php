<?php

declare(strict_types=1);

namespace App\Commands\StartProfileMain;

use App\Commands\StartAgent\StartAgentCommand;
use App\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use App\Contracts\ProfileSelections;
use App\Contracts\StartPreflight;
use App\Enums\ConversationModeType;
use App\Enums\StartOriginType;
use App\Exceptions\ProfileCannotCoordinate;
use App\Models\Agent;
use App\Models\DriverConversation;
use App\Models\Profile;
use App\Support\StartPreviews;
use App\Support\StartReceipt;
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
        $profile = $this->profiles->select($command->profile, $command->requested, $command->driverKey, null);

        if (! $profile->base->isCoordinator()) {
            throw ProfileCannotCoordinate::for($command->profile);
        }

        $agent = Agent::query()->findOrFail($command->agentId);
        $variant = $this->previews->preview(
            $agent,
            $command->driverKey,
            $command->variant,
            $command->requested,
            $profile->defaults,
            null,
        )->mode;
        $this->preflight->assertAdmitted($profile->proposal($variant, $command->requested->model));

        $target = $command->conversationId === null
            ? null
            : DriverConversation::chosenFor($command->conversationId, $agent->id, $profile->selection->driver, null);

        return $this->commands->run(new StartAgentCommand(new StartRequest(
            $command->requestId,
            $command->agentId,
            $profile->selection,
            StartOriginType::MainStart,
            null,
            null,
            $target === null ? ConversationModeType::New : ConversationModeType::Resume,
            null,
            $profile->startPolicy(),
            conversationTarget: $target,
            variant: $variant,
            chosenAccount: $command->chosenAccount,
            savesVariant: $command->saveVariant,
            previewRevision: $command->previewRevision,
        )));
    }
}
