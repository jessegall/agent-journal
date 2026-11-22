<?php

declare(strict_types=1);

namespace App\Supervision\Commands\AskSupervisor;

use App\Actors\Support\ActorIdentity;
use App\Bus\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use App\Hooks\Contracts\ActorWorkStacks;
use App\Supervision\Commands\RouteAsk\RouteAskCommand;
use App\Supervision\Enums\AskOriginType;
use App\Supervision\Exceptions\AskRefused;
use App\Supervision\Models\Ask;
use App\Supervision\Models\AskRequester;
use App\Supervision\Support\AskOpening;
use App\Supervision\Support\AskTypeRegistry;
use App\Supervision\Values\AskReference;

final readonly class AskSupervisorHandler implements CommandHandler
{
    private const int OPEN_LIMIT = 5;

    public function __construct(
        private ActorWorkStacks $stacks,
        private AskTypeRegistry $types,
        private AskOpening $opening,
        private CommandBus $commands,
    ) {}

    public function handle(AskSupervisorCommand $command): AskReference
    {
        $requester = ActorIdentity::of($command->dispatchedBy());
        $body = trim($command->body);
        AskRefused::assertValidSubmission($body, $command->submissionKey);
        AskRequester::lockSubmissions($requester);

        $type = $this->types->get($command->typeKey());
        $retained = Ask::submission($requester, $command->submissionKey);

        if ($retained->isDefined()) {
            return $retained->get()->replay($type->key(), $body);
        }

        if (Ask::openSubmissions($requester) >= self::OPEN_LIMIT) {
            throw AskRefused::openLimit(self::OPEN_LIMIT);
        }

        $work = $this->stacks->currentRecord()->getOrElse(null);

        $ask = $this->opening->open(
            $requester,
            $type,
            $command->submissionKey,
            $body,
            $work,
            AskOriginType::Supervisor,
        );

        $this->commands->run(new RouteAskCommand($ask->reference(), 0));

        return $ask->reference();
    }
}
